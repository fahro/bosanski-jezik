from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
import random

from app.database import get_db
from app.models import (
    User, LessonProgress, FinalTestAttempt,
    calculate_level
)
from app.auth import get_current_user_required
from app.data.a1_lessons import A1_LESSONS

router = APIRouter(prefix="/api/final-test", tags=["final_test"])

class FinalTestSubmission(BaseModel):
    answers: dict  # {question_id: selected_answer_index}
    time_taken_seconds: Optional[int] = None

def get_final_test_questions():
    """Generate 120 questions - 10 from each of the 12 lessons."""
    all_questions = []
    
    for lesson in A1_LESSONS:
        lesson_id = lesson["id"]
        quiz = lesson.get("quiz", [])
        
        # Get 10 random questions from each lesson
        if len(quiz) >= 10:
            selected = random.sample(quiz, 10)
        else:
            # If less than 10, take all and repeat some
            selected = quiz.copy()
            while len(selected) < 10:
                selected.append(random.choice(quiz))
        
        # Add lesson info to each question
        for i, q in enumerate(selected):
            all_questions.append({
                "id": f"{lesson_id}_{q['id']}",
                "lesson_id": lesson_id,
                "lesson_title": lesson["title"],
                "question": q["question"],
                "options": q["options"],
                "correct_answer": q["correct_answer"],
                "explanation": q["explanation"],
                "question_type": q.get("question_type", "vocabulary")
            })
    
    # Shuffle all questions
    random.shuffle(all_questions)
    
    return all_questions

@router.get("/check-eligibility")
async def check_eligibility(
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Check if user can take the final test."""
    progress_records = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.completed == True
    ).all()
    
    completed_lessons = [p.lesson_id for p in progress_records]
    lessons_completed = len(completed_lessons)
    
    # Get previous attempts
    attempts = db.query(FinalTestAttempt).filter(
        FinalTestAttempt.user_id == current_user.id
    ).order_by(FinalTestAttempt.created_at.desc()).all()
    
    passed = any(a.passed for a in attempts)
    best_score = max((a.percentage for a in attempts), default=None)
    
    return {
        "eligible": lessons_completed >= 12,
        "lessons_completed": lessons_completed,
        "total_lessons": 12,
        "completed_lesson_ids": completed_lessons,
        "missing_lessons": [i for i in range(1, 13) if i not in completed_lessons],
        "previous_attempts": len(attempts),
        "passed": passed,
        "best_score": round(best_score, 1) if best_score else None
    }

@router.get("/questions")
async def get_questions(
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Get the final test questions (only if eligible)."""
    # Check eligibility
    progress_records = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.completed == True
    ).all()
    
    if len(progress_records) < 12:
        raise HTTPException(
            status_code=403,
            detail="Morate završiti sve lekcije prije završnog testa"
        )
    
    questions = get_final_test_questions()
    
    # Return questions without correct answers
    return {
        "total_questions": len(questions),
        "time_limit_minutes": 60,
        "passing_percentage": 70,
        "questions": [
            {
                "id": q["id"],
                "lesson_id": q["lesson_id"],
                "lesson_title": q["lesson_title"],
                "question": q["question"],
                "options": q["options"],
                "question_type": q["question_type"]
            }
            for q in questions
        ],
        "_answer_key": {q["id"]: q["correct_answer"] for q in questions}  # Store for validation
    }

@router.post("/submit")
async def submit_final_test(
    submission: FinalTestSubmission,
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Submit the final test."""
    # Check eligibility
    progress_records = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.completed == True
    ).all()
    
    if len(progress_records) < 12:
        raise HTTPException(
            status_code=403,
            detail="Morate završiti sve lekcije prije završnog testa"
        )
    
    # Generate the same questions to get correct answers
    questions = get_final_test_questions()
    answer_key = {q["id"]: q["correct_answer"] for q in questions}
    
    # Calculate score
    score = 0
    lesson_scores = {}
    
    for q in questions:
        q_id = q["id"]
        lesson_id = q["lesson_id"]
        
        if lesson_id not in lesson_scores:
            lesson_scores[lesson_id] = {"correct": 0, "total": 0}
        
        lesson_scores[lesson_id]["total"] += 1
        
        if str(q_id) in submission.answers:
            if submission.answers[str(q_id)] == answer_key[q_id]:
                score += 1
                lesson_scores[lesson_id]["correct"] += 1
    
    total_questions = len(questions)
    percentage = (score / total_questions) * 100 if total_questions > 0 else 0
    passed = percentage >= 70
    
    # Calculate XP
    xp_earned = int(percentage * 2)  # Up to 200 XP for 100%
    if passed:
        xp_earned += 100  # Bonus for passing
    if percentage >= 90:
        xp_earned += 50  # Excellence bonus
    if percentage == 100:
        xp_earned += 100  # Perfect score bonus
    
    # Check if first time passing
    previous_passes = db.query(FinalTestAttempt).filter(
        FinalTestAttempt.user_id == current_user.id,
        FinalTestAttempt.passed == True
    ).count()
    
    if passed and previous_passes == 0:
        xp_earned += 200  # First-time pass bonus
    
    # Create attempt record
    attempt = FinalTestAttempt(
        user_id=current_user.id,
        score=score,
        total_questions=total_questions,
        percentage=percentage,
        passed=passed,
        xp_earned=xp_earned,
        lesson_scores=lesson_scores,
        time_taken_seconds=submission.time_taken_seconds
    )
    db.add(attempt)
    
    # Add XP
    current_user.total_xp += xp_earned
    current_user.current_level = calculate_level(current_user.total_xp)
    current_user.last_activity = datetime.utcnow()
    
    db.commit()
    
    # Prepare detailed results
    lesson_results = []
    for lesson_id, scores in sorted(lesson_scores.items()):
        lesson = next((l for l in A1_LESSONS if l["id"] == lesson_id), None)
        lesson_results.append({
            "lesson_id": lesson_id,
            "lesson_title": lesson["title"] if lesson else f"Lekcija {lesson_id}",
            "correct": scores["correct"],
            "total": scores["total"],
            "percentage": round((scores["correct"] / scores["total"]) * 100, 1) if scores["total"] > 0 else 0
        })
    
    return {
        "success": True,
        "score": score,
        "total_questions": total_questions,
        "percentage": round(percentage, 1),
        "passed": passed,
        "xp_earned": xp_earned,
        "total_xp": current_user.total_xp,
        "current_level": current_user.current_level,
        "lesson_results": lesson_results,
        "time_taken_seconds": submission.time_taken_seconds,
        "certificate_eligible": passed
    }

@router.get("/history")
async def get_test_history(
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Get user's final test attempt history."""
    attempts = db.query(FinalTestAttempt).filter(
        FinalTestAttempt.user_id == current_user.id
    ).order_by(FinalTestAttempt.created_at.desc()).all()
    
    return [
        {
            "id": a.id,
            "score": a.score,
            "total_questions": a.total_questions,
            "percentage": round(a.percentage, 1),
            "passed": a.passed,
            "xp_earned": a.xp_earned,
            "time_taken_seconds": a.time_taken_seconds,
            "created_at": a.created_at.isoformat()
        }
        for a in attempts
    ]
