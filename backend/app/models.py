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

# XP and Level configuration (20 levels, slower progression)
LEVEL_CONFIG = {
    1: {"name": "Početnik", "min_xp": 0, "title": "Beginner"},
    2: {"name": "Učenik I", "min_xp": 25, "title": "Student I"},
    3: {"name": "Učenik II", "min_xp": 60, "title": "Student II"},
    4: {"name": "Učenik III", "min_xp": 100, "title": "Student III"},
    5: {"name": "Napredni Učenik I", "min_xp": 150, "title": "Advanced Student I"},
    6: {"name": "Napredni Učenik II", "min_xp": 210, "title": "Advanced Student II"},
    7: {"name": "Srednji Nivo I", "min_xp": 280, "title": "Intermediate I"},
    8: {"name": "Srednji Nivo II", "min_xp": 360, "title": "Intermediate II"},
    9: {"name": "Srednji Nivo III", "min_xp": 450, "title": "Intermediate III"},
    10: {"name": "Napredni I", "min_xp": 550, "title": "Advanced I"},
    11: {"name": "Napredni II", "min_xp": 660, "title": "Advanced II"},
    12: {"name": "Napredni III", "min_xp": 780, "title": "Advanced III"},
    13: {"name": "Stručnjak I", "min_xp": 910, "title": "Expert I"},
    14: {"name": "Stručnjak II", "min_xp": 1050, "title": "Expert II"},
    15: {"name": "Majstor I", "min_xp": 1200, "title": "Master I"},
    16: {"name": "Majstor II", "min_xp": 1360, "title": "Master II"},
    17: {"name": "Virtuoz", "min_xp": 1530, "title": "Virtuoso"},
    18: {"name": "Guru", "min_xp": 1710, "title": "Guru"},
    19: {"name": "Legenda", "min_xp": 1900, "title": "Legend"},
    20: {"name": "Bosanski Majstor", "min_xp": 2100, "title": "Bosnian Master"},
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
    return LEVEL_CONFIG[20]["min_xp"]

def calculate_quiz_xp(score: int, total: int, is_first_attempt: bool = False) -> int:
    """Calculate XP earned from a quiz (reduced amounts for slower progression)."""
    percentage = (score / total) * 100 if total > 0 else 0
    
    base_xp = int(percentage * 0.15)  # Up to 15 XP for 100%
    
    # Bonus for first completion
    if is_first_attempt and percentage >= 70:
        base_xp += 8
    
    # Perfect score bonus
    if percentage == 100:
        base_xp += 5
    
    return base_xp
