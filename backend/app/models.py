from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    
    # Progress tracking
    total_xp = Column(Integer, default=0)
    current_level = Column(Integer, default=1)
    current_lesson_id = Column(Integer, default=1)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    lesson_progress = relationship("LessonProgress", back_populates="user")
    quiz_attempts = relationship("QuizAttempt", back_populates="user")
    final_test_attempts = relationship("FinalTestAttempt", back_populates="user")

class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, nullable=False)
    
    # Progress details
    completed = Column(Boolean, default=False)
    vocabulary_viewed = Column(Boolean, default=False)
    grammar_viewed = Column(Boolean, default=False)
    dialogue_viewed = Column(Boolean, default=False)
    culture_viewed = Column(Boolean, default=False)
    exercises_completed = Column(Boolean, default=False)
    quiz_completed = Column(Boolean, default=False)
    
    # Best scores
    best_quiz_score = Column(Integer, default=0)
    best_quiz_percentage = Column(Float, default=0.0)
    best_exercise_score = Column(Integer, default=0)
    best_exercise_percentage = Column(Float, default=0.0)
    exercises_passed = Column(Boolean, default=False)
    quiz_passed = Column(Boolean, default=False)
    
    # Saved progress state (for resuming)
    saved_quiz_answers = Column(JSON, nullable=True)  # {questionIndex: answerIndex, ...}
    saved_quiz_position = Column(Integer, default=0)  # Current question index
    saved_exercise_answers = Column(JSON, nullable=True)  # {exerciseType: {id: answer}, ...}
    
    # XP earned from this lesson
    xp_earned = Column(Integer, default=0)
    
    # Timestamps
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    last_accessed = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="lesson_progress")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, nullable=False)
    
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)
    xp_earned = Column(Integer, default=0)
    
    # Track which questions were answered correctly
    answers = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="quiz_attempts")

class FinalTestAttempt(Base):
    __tablename__ = "final_test_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, default=120)
    percentage = Column(Float, nullable=False)
    passed = Column(Boolean, default=False)
    xp_earned = Column(Integer, default=0)
    
    # Detailed results per lesson
    lesson_scores = Column(JSON, nullable=True)
    
    time_taken_seconds = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="final_test_attempts")

# XP and Level configuration
LEVEL_CONFIG = {
    1: {"name": "Početnik", "min_xp": 0, "title": "Beginner"},
    2: {"name": "Učenik", "min_xp": 100, "title": "Student"},
    3: {"name": "Napredni Učenik", "min_xp": 300, "title": "Advanced Student"},
    4: {"name": "Srednji Nivo", "min_xp": 600, "title": "Intermediate"},
    5: {"name": "Napredni", "min_xp": 1000, "title": "Advanced"},
    6: {"name": "Stručnjak", "min_xp": 1500, "title": "Expert"},
    7: {"name": "Majstor", "min_xp": 2200, "title": "Master"},
    8: {"name": "Virtuoz", "min_xp": 3000, "title": "Virtuoso"},
    9: {"name": "Guru", "min_xp": 4000, "title": "Guru"},
    10: {"name": "Legenda", "min_xp": 5500, "title": "Legend"},
}

def calculate_level(total_xp: int) -> int:
    """Calculate user level based on total XP."""
    level = 1
    for lvl, config in LEVEL_CONFIG.items():
        if total_xp >= config["min_xp"]:
            level = lvl
    return level

def get_xp_for_next_level(current_level: int) -> int:
    """Get XP required for next level."""
    next_level = current_level + 1
    if next_level in LEVEL_CONFIG:
        return LEVEL_CONFIG[next_level]["min_xp"]
    return LEVEL_CONFIG[10]["min_xp"]

def calculate_quiz_xp(score: int, total: int, is_first_attempt: bool = False) -> int:
    """Calculate XP earned from a quiz."""
    percentage = (score / total) * 100 if total > 0 else 0
    
    base_xp = int(percentage * 0.5)  # Up to 50 XP for 100%
    
    # Bonus for first completion
    if is_first_attempt and percentage >= 70:
        base_xp += 25
    
    # Perfect score bonus
    if percentage == 100:
        base_xp += 15
    
    return base_xp
