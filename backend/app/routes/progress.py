from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_db
from app.models import (
    User, LessonProgress, QuizAttempt, FinalTestAttempt,
    LEVEL_CONFIG, calculate_level, get_xp_for_next_level, calculate_quiz_xp
)
from app.auth import get_current_user_required, get_current_user

router = APIRouter(prefix="/api/progress", tags=["progress"])

class LessonProgressResponse(BaseModel):
    lesson_id: int
    completed: bool
    vocabulary_viewed: bool
    grammar_viewed: bool
    dialogue_viewed: bool
    culture_viewed: bool
    exercises_completed: bool
    quiz_completed: bool
    best_quiz_score: int
    best_quiz_percentage: float
    xp_earned: int

class QuizSubmission(BaseModel):
    lesson_id: int
    score: int
    total_questions: int
    answers: Optional[dict] = None

class ExerciseSubmission(BaseModel):
    lesson_id: int
    score: int
    total_exercises: int
    exercise_type: Optional[str] = None

class UserStatsResponse(BaseModel):
    total_xp: int
    current_level: int
    level_name: str
    level_title: str
    xp_for_next_level: int
    xp_progress_in_level: int
    lessons_completed: int
    total_lessons: int
    quizzes_completed: int
    average_quiz_score: float
    can_take_final_test: bool
    final_test_passed: bool
    best_final_score: Optional[float]

@router.get("/stats")
async def get_user_stats(
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Get comprehensive user statistics."""
    # Get lesson progress
    progress_records = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id
    ).all()
    
    lessons_completed = sum(1 for p in progress_records if p.completed)
    quizzes_completed = sum(1 for p in progress_records if p.quiz_completed)
    
    # Calculate average quiz score
    quiz_attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    ).all()
    
    avg_score = 0.0
    if quiz_attempts:
        avg_score = sum(a.percentage for a in quiz_attempts) / len(quiz_attempts)
    
    # Check final test status
    final_attempts = db.query(FinalTestAttempt).filter(
        FinalTestAttempt.user_id == current_user.id
    ).all()
    
    final_passed = any(a.passed for a in final_attempts)
    best_final = max((a.percentage for a in final_attempts), default=None)
    
    # Level info
    level_config = LEVEL_CONFIG.get(current_user.current_level, LEVEL_CONFIG[1])
    current_level_min_xp = level_config["min_xp"]
    next_level_xp = get_xp_for_next_level(current_user.current_level)
    xp_progress = current_user.total_xp - current_level_min_xp
    
    return {
        "total_xp": current_user.total_xp,
        "current_level": current_user.current_level,
        "level_name": level_config["name"],
        "level_title": level_config["title"],
        "xp_for_next_level": next_level_xp,
        "xp_progress_in_level": xp_progress,
        "xp_needed_for_next": next_level_xp - current_user.total_xp,
        "lessons_completed": lessons_completed,
        "total_lessons": 12,
        "quizzes_completed": quizzes_completed,
        "average_quiz_score": round(avg_score, 1),
        "can_take_final_test": lessons_completed >= 12,
        "final_test_passed": final_passed,
        "best_final_score": round(best_final, 1) if best_final else None,
        "current_lesson_id": current_user.current_lesson_id
    }

@router.get("/lessons")
async def get_all_lesson_progress(
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Get progress for all lessons."""
    progress_records = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id
    ).all()
    
    # Create a dict for easy lookup
    progress_dict = {p.lesson_id: p for p in progress_records}
    
    # Return progress for all 12 lessons
    result = []
    for lesson_id in range(1, 13):
        if lesson_id in progress_dict:
            p = progress_dict[lesson_id]
            result.append({
                "lesson_id": lesson_id,
                "completed": p.completed,
                "vocabulary_viewed": p.vocabulary_viewed,
                "grammar_viewed": p.grammar_viewed,
                "dialogue_viewed": p.dialogue_viewed,
                "culture_viewed": p.culture_viewed,
                "exercises_completed": p.exercises_completed,
                "exercises_passed": getattr(p, 'exercises_passed', False),
                "best_exercise_percentage": getattr(p, 'best_exercise_percentage', 0.0),
                "quiz_completed": p.quiz_completed,
                "quiz_passed": getattr(p, 'quiz_passed', False),
                "best_quiz_score": p.best_quiz_score,
                "best_quiz_percentage": p.best_quiz_percentage,
                "xp_earned": p.xp_earned,
                "started": True
            })
        else:
            result.append({
                "lesson_id": lesson_id,
                "completed": False,
                "vocabulary_viewed": False,
                "grammar_viewed": False,
                "dialogue_viewed": False,
                "culture_viewed": False,
                "exercises_completed": False,
                "exercises_passed": False,
                "best_exercise_percentage": 0.0,
                "quiz_completed": False,
                "quiz_passed": False,
                "best_quiz_score": 0,
                "best_quiz_percentage": 0.0,
                "xp_earned": 0,
                "started": False
            })
    
    return result

@router.get("/lessons/{lesson_id}")
async def get_lesson_progress(
    lesson_id: int,
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Get progress for a specific lesson."""
    progress = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.lesson_id == lesson_id
    ).first()
    
    if not progress:
        return {
            "lesson_id": lesson_id,
            "completed": False,
            "vocabulary_viewed": False,
            "grammar_viewed": False,
            "dialogue_viewed": False,
            "culture_viewed": False,
            "exercises_completed": False,
            "exercises_passed": False,
            "best_exercise_percentage": 0.0,
            "quiz_completed": False,
            "quiz_passed": False,
            "best_quiz_score": 0,
            "best_quiz_percentage": 0.0,
            "xp_earned": 0,
            "started": False
        }
    
    return {
        "lesson_id": progress.lesson_id,
        "completed": progress.completed,
        "vocabulary_viewed": progress.vocabulary_viewed,
        "grammar_viewed": progress.grammar_viewed,
        "dialogue_viewed": progress.dialogue_viewed,
        "culture_viewed": progress.culture_viewed,
        "exercises_completed": progress.exercises_completed,
        "exercises_passed": getattr(progress, 'exercises_passed', False),
        "best_exercise_percentage": getattr(progress, 'best_exercise_percentage', 0.0),
        "quiz_completed": progress.quiz_completed,
        "quiz_passed": getattr(progress, 'quiz_passed', False),
        "best_quiz_score": progress.best_quiz_score,
        "best_quiz_percentage": progress.best_quiz_percentage,
        "xp_earned": progress.xp_earned,
        "started": True
    }

@router.post("/lessons/{lesson_id}/view")
async def update_lesson_view(
    lesson_id: int,
    view_data: dict,
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Update which sections of a lesson have been viewed."""
    progress = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.lesson_id == lesson_id
    ).first()
    
    if not progress:
        progress = LessonProgress(
            user_id=current_user.id,
            lesson_id=lesson_id
        )
        db.add(progress)
    
    # Update viewed sections
    xp_gained = 0
    
    if view_data.get("vocabulary") and not progress.vocabulary_viewed:
        progress.vocabulary_viewed = True
        xp_gained += 5
    
    if view_data.get("grammar") and not progress.grammar_viewed:
        progress.grammar_viewed = True
        xp_gained += 5
    
    if view_data.get("dialogue") and not progress.dialogue_viewed:
        progress.dialogue_viewed = True
        xp_gained += 5
    
    if view_data.get("culture") and not progress.culture_viewed:
        progress.culture_viewed = True
        xp_gained += 5
    
    if view_data.get("exercises") and not progress.exercises_completed:
        progress.exercises_completed = True
        xp_gained += 10
    
    # Add XP
    if xp_gained > 0:
        progress.xp_earned += xp_gained
        current_user.total_xp += xp_gained
        current_user.current_level = calculate_level(current_user.total_xp)
    
    progress.last_accessed = datetime.utcnow()
    current_user.last_activity = datetime.utcnow()
    
    # Update current lesson if this is further
    if lesson_id > current_user.current_lesson_id:
        current_user.current_lesson_id = lesson_id
    
    db.commit()
    
    return {
        "success": True,
        "xp_gained": xp_gained,
        "total_xp": current_user.total_xp,
        "current_level": current_user.current_level
    }

@router.post("/quiz/submit")
async def submit_quiz(
    submission: QuizSubmission,
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Submit a quiz attempt and get XP."""
    percentage = (submission.score / submission.total_questions) * 100 if submission.total_questions > 0 else 0
    
    # Get or create lesson progress
    progress = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.lesson_id == submission.lesson_id
    ).first()
    
    if not progress:
        progress = LessonProgress(
            user_id=current_user.id,
            lesson_id=submission.lesson_id
        )
        db.add(progress)
    
    # Check if first quiz completion for this lesson
    is_first = not progress.quiz_completed
    
    # Calculate XP
    xp_earned = calculate_quiz_xp(submission.score, submission.total_questions, is_first)
    
    # Create quiz attempt record
    attempt = QuizAttempt(
        user_id=current_user.id,
        lesson_id=submission.lesson_id,
        score=submission.score,
        total_questions=submission.total_questions,
        percentage=percentage,
        xp_earned=xp_earned,
        answers=submission.answers
    )
    db.add(attempt)
    
    # Update progress
    progress.quiz_completed = True
    if percentage > progress.best_quiz_percentage:
        progress.best_quiz_score = submission.score
        progress.best_quiz_percentage = percentage
    
    # Mark quiz as passed if >= 70%
    if percentage >= 70:
        progress.quiz_passed = True
    
    # Check if lesson is now complete (exercises passed + quiz passed)
    exercises_passed = getattr(progress, 'exercises_passed', False)
    lesson_just_completed = False
    if exercises_passed and progress.quiz_passed and not progress.completed:
        progress.completed = True
        progress.completed_at = datetime.utcnow()
        xp_earned += 50  # Bonus for completing lesson
        lesson_just_completed = True
    
    # Add XP
    progress.xp_earned += xp_earned
    current_user.total_xp += xp_earned
    current_user.current_level = calculate_level(current_user.total_xp)
    
    # Update current lesson only if BOTH exercises and quiz passed
    if exercises_passed and progress.quiz_passed and submission.lesson_id >= current_user.current_lesson_id:
        if submission.lesson_id < 12:
            current_user.current_lesson_id = submission.lesson_id + 1
    
    current_user.last_activity = datetime.utcnow()
    db.commit()
    
    return {
        "success": True,
        "score": submission.score,
        "total_questions": submission.total_questions,
        "percentage": round(percentage, 1),
        "passed": percentage >= 70,
        "xp_earned": xp_earned,
        "total_xp": current_user.total_xp,
        "current_level": current_user.current_level,
        "lesson_completed": progress.completed,
        "is_new_high_score": percentage >= progress.best_quiz_percentage
    }

@router.post("/exercises/submit")
async def submit_exercises(
    submission: ExerciseSubmission,
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """Submit exercise results and get XP."""
    percentage = (submission.score / submission.total_exercises) * 100 if submission.total_exercises > 0 else 0
    
    # Get or create lesson progress
    progress = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.lesson_id == submission.lesson_id
    ).first()
    
    if not progress:
        progress = LessonProgress(
            user_id=current_user.id,
            lesson_id=submission.lesson_id
        )
        db.add(progress)
    
    # Check if first exercise completion for this lesson
    is_first = not progress.exercises_completed
    
    # Calculate XP (similar to quiz)
    xp_earned = int(percentage * 0.3)  # Up to 30 XP for 100%
    if is_first and percentage >= 70:
        xp_earned += 15  # Bonus for first pass
    
    # Update progress
    progress.exercises_completed = True
    if percentage > getattr(progress, 'best_exercise_percentage', 0):
        progress.best_exercise_score = submission.score
        progress.best_exercise_percentage = percentage
    
    # Mark exercises as passed if >= 70%
    if percentage >= 70:
        progress.exercises_passed = True
    
    # Check if lesson is now complete (exercises passed + quiz passed)
    quiz_passed = getattr(progress, 'quiz_passed', False)
    lesson_just_completed = False
    if progress.exercises_passed and quiz_passed and not progress.completed:
        progress.completed = True
        progress.completed_at = datetime.utcnow()
        xp_earned += 50  # Bonus for completing lesson
        lesson_just_completed = True
    
    # Add XP
    progress.xp_earned += xp_earned
    current_user.total_xp += xp_earned
    current_user.current_level = calculate_level(current_user.total_xp)
    
    # Update current lesson only if BOTH exercises and quiz passed
    if progress.exercises_passed and quiz_passed and submission.lesson_id >= current_user.current_lesson_id:
        if submission.lesson_id < 12:
            current_user.current_lesson_id = submission.lesson_id + 1
    
    current_user.last_activity = datetime.utcnow()
    db.commit()
    
    return {
        "success": True,
        "score": submission.score,
        "total_exercises": submission.total_exercises,
        "percentage": round(percentage, 1),
        "passed": percentage >= 70,
        "xp_earned": xp_earned,
        "total_xp": current_user.total_xp,
        "current_level": current_user.current_level,
        "lesson_completed": progress.completed,
        "exercises_passed": progress.exercises_passed,
        "quiz_passed": quiz_passed,
        "is_new_high_score": percentage > getattr(progress, 'best_exercise_percentage', 0)
    }

@router.get("/levels")
async def get_all_levels():
    """Get all level configurations."""
    return [
        {
            "level": level,
            "name": config["name"],
            "title": config["title"],
            "min_xp": config["min_xp"]
        }
        for level, config in LEVEL_CONFIG.items()
    ]
