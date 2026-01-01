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
from app.data.a2_lessons import A2_LESSONS
from app.data.b1_lessons import B1_LESSONS
from app.data.b1_lessons_2 import B1_LESSONS_PART2
from app.data.b1_lessons_3 import B1_LESSONS_PART3

# Combine B1 lessons
B1_ALL_LESSONS = B1_LESSONS + B1_LESSONS_PART2 + B1_LESSONS_PART3

# Level to lessons mapping
LEVEL_LESSONS = {
    "a1": A1_LESSONS,
    "a2": A2_LESSONS,
    "b1": B1_ALL_LESSONS
}

# Next level mapping
NEXT_LEVEL = {
    "a1": "a2",
    "a2": "b1",
    "b1": "b2"
}

router = APIRouter(prefix="/api/final-test", tags=["final_test"])

class FinalTestSubmission(BaseModel):
    answers: dict  # {question_id: selected_answer_index or written_text}
    writing_answers: dict = {}  # {question_id: written_text}
    time_taken_seconds: Optional[int] = None

def normalize_text(text: str) -> str:
    """Normalize text for comparison (lowercase, strip, remove extra spaces)."""
    return ' '.join(text.lower().strip().split())

def check_writing_answer(user_answer: str, correct_answer: str) -> bool:
    """Check if writing answer is correct (case-insensitive, trimmed)."""
    return normalize_text(user_answer) == normalize_text(correct_answer)

def get_final_test_questions(level: str = "a1"):
    """Generate questions - 8 multiple choice + 2 writing from each of the 12 lessons."""
    all_questions = []
    lessons = LEVEL_LESSONS.get(level, A1_LESSONS)
    
    for lesson in lessons:
        lesson_id = lesson["id"]
        quiz = lesson.get("quiz", [])
        
        # Separate multiple choice and writing questions
        mc_questions = [q for q in quiz if q.get("question_type") != "writing"]
        writing_questions = [q for q in quiz if q.get("question_type") == "writing"]
        
        # Get 8 multiple choice questions
        if len(mc_questions) >= 8:
            selected_mc = random.sample(mc_questions, 8)
        else:
            selected_mc = mc_questions.copy()
            while len(selected_mc) < 8 and mc_questions:
                selected_mc.append(random.choice(mc_questions))
        
        # Get 2 writing questions
        if len(writing_questions) >= 2:
            selected_writing = random.sample(writing_questions, 2)
        elif len(writing_questions) == 1:
            selected_writing = writing_questions.copy()
        else:
            selected_writing = []
        
        # Add multiple choice questions
        for q in selected_mc:
            all_questions.append({
                "id": f"{lesson_id}_{q['id']}",
                "lesson_id": lesson_id,
                "lesson_title": lesson["title"],
                "question": q["question"],
                "options": q.get("options", []),
                "correct_answer": q.get("correct_answer"),
                "explanation": q["explanation"],
                "question_type": q.get("question_type", "vocabulary")
            })
        
        # Add writing questions
        for q in selected_writing:
            all_questions.append({
                "id": f"{lesson_id}_{q['id']}_w",
                "lesson_id": lesson_id,
                "lesson_title": lesson["title"],
                "question": q["question"],
                "options": [],  # No options for writing
                "correct_answer_text": q.get("correct_answer_text", ""),
                "explanation": q["explanation"],
                "question_type": "writing"
            })
    
    # Shuffle all questions
    random.shuffle(all_questions)
    
    return all_questions

@router.get("/check-eligibility")
async def check_eligibility(
    level: str = "a1",
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Check if user can take the final test for a specific level."""
    # Get progress for the specific level
    progress_records = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.level == level,
        LessonProgress.completed == True
    ).all()
    
    completed_lessons = [p.lesson_id for p in progress_records]
    lessons_completed = len(completed_lessons)
    
    # Get previous attempts for this level
    attempts = db.query(FinalTestAttempt).filter(
        FinalTestAttempt.user_id == current_user.id,
        FinalTestAttempt.level == level
    ).order_by(FinalTestAttempt.created_at.desc()).all()
    
    passed = any(a.passed for a in attempts)
    best_score = max((a.percentage for a in attempts), default=None)
    
    # Check if next level is unlocked
    next_level = NEXT_LEVEL.get(level)
    next_level_unlocked = False
    if next_level:
        next_level_unlocked = db.query(LessonProgress).filter(
            LessonProgress.user_id == current_user.id,
            LessonProgress.level == next_level
        ).first() is not None
    
    return {
        "level": level,
        "eligible": lessons_completed >= 12,
        "lessons_completed": lessons_completed,
        "total_lessons": 12,
        "completed_lesson_ids": completed_lessons,
        "missing_lessons": [i for i in range(1, 13) if i not in completed_lessons],
        "previous_attempts": len(attempts),
        "passed": passed,
        "best_score": round(best_score, 1) if best_score else None,
        "next_level": next_level,
        "next_level_unlocked": next_level_unlocked
    }

@router.get("/questions")
async def get_questions(
    level: str = "a1",
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Get the final test questions (only if eligible)."""
    # Check eligibility for this level
    progress_records = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.level == level,
        LessonProgress.completed == True
    ).all()
    
    if len(progress_records) < 12:
        raise HTTPException(
            status_code=403,
            detail=f"Morate završiti sve {level.upper()} lekcije prije završnog testa"
        )
    
    questions = get_final_test_questions(level)
    
    # Count question types
    mc_count = sum(1 for q in questions if q["question_type"] != "writing")
    writing_count = sum(1 for q in questions if q["question_type"] == "writing")
    
    # Return questions without correct answers
    return {
        "total_questions": len(questions),
        "multiple_choice_count": mc_count,
        "writing_count": writing_count,
        "time_limit_minutes": 60,
        "passing_percentage": 70,
        "questions": [
            {
                "id": q["id"],
                "lesson_id": q["lesson_id"],
                "lesson_title": q["lesson_title"],
                "question": q["question"],
                "options": q["options"] if q["question_type"] != "writing" else [],
                "question_type": q["question_type"]
            }
            for q in questions
        ]
    }

class FinalTestSubmissionWithLevel(BaseModel):
    answers: dict
    writing_answers: dict = {}
    time_taken_seconds: Optional[int] = None
    level: str = "a1"

@router.post("/submit")
async def submit_final_test(
    submission: FinalTestSubmissionWithLevel,
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Submit the final test."""
    level = submission.level
    
    # Check eligibility for this level
    progress_records = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.level == level,
        LessonProgress.completed == True
    ).all()
    
    if len(progress_records) < 12:
        raise HTTPException(
            status_code=403,
            detail=f"Morate završiti sve {level.upper()} lekcije prije završnog testa"
        )
    
    # Generate the same questions to get correct answers
    questions = get_final_test_questions(level)
    lessons = LEVEL_LESSONS.get(level, A1_LESSONS)
    
    # Build answer keys for both types
    mc_answer_key = {q["id"]: q["correct_answer"] for q in questions if q["question_type"] != "writing"}
    writing_answer_key = {q["id"]: q.get("correct_answer_text", "") for q in questions if q["question_type"] == "writing"}
    
    # Calculate score
    score = 0
    writing_score = 0
    mc_score = 0
    lesson_scores = {}
    writing_results = []  # Track writing answers for feedback
    
    for q in questions:
        q_id = q["id"]
        lesson_id = q["lesson_id"]
        
        if lesson_id not in lesson_scores:
            lesson_scores[lesson_id] = {"correct": 0, "total": 0, "writing_correct": 0, "writing_total": 0}
        
        lesson_scores[lesson_id]["total"] += 1
        
        if q["question_type"] == "writing":
            lesson_scores[lesson_id]["writing_total"] += 1
            # Check writing answer
            user_answer = submission.writing_answers.get(str(q_id), "")
            correct_answer = writing_answer_key.get(q_id, "")
            is_correct = check_writing_answer(user_answer, correct_answer)
            
            writing_results.append({
                "question_id": q_id,
                "question": q["question"],
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "is_correct": is_correct
            })
            
            if is_correct:
                score += 1
                writing_score += 1
                lesson_scores[lesson_id]["correct"] += 1
                lesson_scores[lesson_id]["writing_correct"] += 1
        else:
            # Check multiple choice answer
            if str(q_id) in submission.answers:
                if submission.answers[str(q_id)] == mc_answer_key.get(q_id):
                    score += 1
                    mc_score += 1
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
    
    # Check if first time passing for this level
    previous_passes = db.query(FinalTestAttempt).filter(
        FinalTestAttempt.user_id == current_user.id,
        FinalTestAttempt.level == level,
        FinalTestAttempt.passed == True
    ).count()
    
    first_time_pass = passed and previous_passes == 0
    if first_time_pass:
        xp_earned += 200  # First-time pass bonus
    
    # Create attempt record
    attempt = FinalTestAttempt(
        user_id=current_user.id,
        level=level,
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
    
    # UNLOCK NEXT LEVEL: When user passes final test for the first time
    next_level = NEXT_LEVEL.get(level)
    next_level_unlocked = False
    if first_time_pass and next_level:
        # Check if next level progress already exists
        existing_next = db.query(LessonProgress).filter(
            LessonProgress.user_id == current_user.id,
            LessonProgress.level == next_level
        ).first()
        
        if not existing_next:
            # Create initial progress for lesson 1 (unlocked, not completed)
            next_level_progress = LessonProgress(
                user_id=current_user.id,
                lesson_id=1,
                level=next_level,
                completed=False,
                vocabulary_viewed=False,
                grammar_viewed=False,
                dialogue_viewed=False,
                culture_viewed=False,
                exercises_completed=False,
                quiz_completed=False
            )
            db.add(next_level_progress)
            next_level_unlocked = True
    
    db.commit()
    
    # Prepare detailed results
    lesson_results = []
    for lesson_id, scores in sorted(lesson_scores.items()):
        lesson = next((l for l in lessons if l["id"] == lesson_id), None)
        lesson_results.append({
            "lesson_id": lesson_id,
            "lesson_title": lesson["title"] if lesson else f"Lekcija {lesson_id}",
            "correct": scores["correct"],
            "total": scores["total"],
            "percentage": round((scores["correct"] / scores["total"]) * 100, 1) if scores["total"] > 0 else 0
        })
    
    # Calculate writing stats
    total_writing = len(writing_results)
    writing_percentage = (writing_score / total_writing * 100) if total_writing > 0 else 0
    
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
        "certificate_eligible": passed,
        # Writing-specific results
        "writing_score": writing_score,
        "writing_total": total_writing,
        "writing_percentage": round(writing_percentage, 1),
        "writing_results": writing_results,
        # Multiple choice stats
        "mc_score": mc_score,
        "mc_total": total_questions - total_writing,
        # Next level unlock status
        "level": level,
        "next_level": next_level,
        "next_level_unlocked": next_level_unlocked,
        "first_time_pass": first_time_pass
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
