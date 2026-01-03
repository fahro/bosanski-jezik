"""Seed script to create initial users."""
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from .models import Base, User, LessonProgress

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_users():
    """Create superadmin and regular user accounts."""
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if superadmin exists
        superadmin = db.query(User).filter(User.username == "superadmin").first()
        if not superadmin:
            superadmin = User(
                username="superadmin",
                email="superadmin@bosanski.ba",
                full_name="Super Admin",
                hashed_password=get_password_hash("superadmin123"),
                current_lesson_id=12,  # Access to all lessons
                total_xp=10000,
                current_level=10
            )
            db.add(superadmin)
            db.flush()  # Get the user ID
            
            # Create progress for all A1 lessons (all passed)
            for lesson_id in range(1, 13):
                progress = LessonProgress(
                    user_id=superadmin.id,
                    lesson_id=lesson_id,
                    level="a1",
                    completed=True,
                    vocabulary_viewed=True,
                    grammar_viewed=True,
                    dialogue_viewed=True,
                    culture_viewed=True,
                    exercises_completed=True,
                    exercises_passed=True,
                    best_exercise_score=20,
                    best_exercise_percentage=100.0,
                    quiz_completed=True,
                    quiz_passed=True,
                    best_quiz_score=15,
                    best_quiz_percentage=100.0,
                    xp_earned=100
                )
                db.add(progress)
            
            # Create progress for all A2 lessons (all passed)
            for lesson_id in range(1, 13):
                progress = LessonProgress(
                    user_id=superadmin.id,
                    lesson_id=lesson_id,
                    level="a2",
                    completed=True,
                    vocabulary_viewed=True,
                    grammar_viewed=True,
                    dialogue_viewed=True,
                    culture_viewed=True,
                    exercises_completed=True,
                    exercises_passed=True,
                    best_exercise_score=20,
                    best_exercise_percentage=100.0,
                    quiz_completed=True,
                    quiz_passed=True,
                    best_quiz_score=15,
                    best_quiz_percentage=100.0,
                    xp_earned=100
                )
                db.add(progress)
            
            # Create progress for all B1 lessons (all passed)
            for lesson_id in range(1, 13):
                progress = LessonProgress(
                    user_id=superadmin.id,
                    lesson_id=lesson_id,
                    level="b1",
                    completed=True,
                    vocabulary_viewed=True,
                    grammar_viewed=True,
                    dialogue_viewed=True,
                    culture_viewed=True,
                    exercises_completed=True,
                    exercises_passed=True,
                    best_exercise_score=20,
                    best_exercise_percentage=100.0,
                    quiz_completed=True,
                    quiz_passed=True,
                    best_quiz_score=15,
                    best_quiz_percentage=100.0,
                    xp_earned=100
                )
                db.add(progress)
            
            # Create progress for all B2 lessons (all passed)
            for lesson_id in range(1, 13):
                progress = LessonProgress(
                    user_id=superadmin.id,
                    lesson_id=lesson_id,
                    level="b2",
                    completed=True,
                    vocabulary_viewed=True,
                    grammar_viewed=True,
                    dialogue_viewed=True,
                    culture_viewed=True,
                    exercises_completed=True,
                    exercises_passed=True,
                    best_exercise_score=20,
                    best_exercise_percentage=100.0,
                    quiz_completed=True,
                    quiz_passed=True,
                    best_quiz_score=15,
                    best_quiz_percentage=100.0,
                    xp_earned=100
                )
                db.add(progress)
            
            print("Created superadmin user with all A1, A2, B1 and B2 lessons completed")
        else:
            # Update superadmin to have access to all lessons
            superadmin.current_lesson_id = 12
            
            # Check if A2 progress exists, if not add it
            a2_progress = db.query(LessonProgress).filter(
                LessonProgress.user_id == superadmin.id,
                LessonProgress.level == "a2"
            ).first()
            
            if not a2_progress:
                # Add A2 lesson progress
                for lesson_id in range(1, 13):
                    progress = LessonProgress(
                        user_id=superadmin.id,
                        lesson_id=lesson_id,
                        level="a2",
                        completed=True,
                        vocabulary_viewed=True,
                        grammar_viewed=True,
                        dialogue_viewed=True,
                        culture_viewed=True,
                        exercises_completed=True,
                        exercises_passed=True,
                        best_exercise_score=20,
                        best_exercise_percentage=100.0,
                        quiz_completed=True,
                        quiz_passed=True,
                        best_quiz_score=15,
                        best_quiz_percentage=100.0,
                        xp_earned=100
                    )
                    db.add(progress)
                print("Added A2 progress for superadmin")
            
            # Check if B1 progress exists, if not add it
            b1_progress = db.query(LessonProgress).filter(
                LessonProgress.user_id == superadmin.id,
                LessonProgress.level == "b1"
            ).first()
            
            if not b1_progress:
                # Add B1 lesson progress
                for lesson_id in range(1, 13):
                    progress = LessonProgress(
                        user_id=superadmin.id,
                        lesson_id=lesson_id,
                        level="b1",
                        completed=True,
                        vocabulary_viewed=True,
                        grammar_viewed=True,
                        dialogue_viewed=True,
                        culture_viewed=True,
                        exercises_completed=True,
                        exercises_passed=True,
                        best_exercise_score=20,
                        best_exercise_percentage=100.0,
                        quiz_completed=True,
                        quiz_passed=True,
                        best_quiz_score=15,
                        best_quiz_percentage=100.0,
                        xp_earned=100
                    )
                    db.add(progress)
                print("Added B1 progress for superadmin")
            
            # Check if B2 progress exists, if not add it
            b2_progress = db.query(LessonProgress).filter(
                LessonProgress.user_id == superadmin.id,
                LessonProgress.level == "b2"
            ).first()
            
            if not b2_progress:
                # Add B2 lesson progress
                for lesson_id in range(1, 13):
                    progress = LessonProgress(
                        user_id=superadmin.id,
                        lesson_id=lesson_id,
                        level="b2",
                        completed=True,
                        vocabulary_viewed=True,
                        grammar_viewed=True,
                        dialogue_viewed=True,
                        culture_viewed=True,
                        exercises_completed=True,
                        exercises_passed=True,
                        best_exercise_score=20,
                        best_exercise_percentage=100.0,
                        quiz_completed=True,
                        quiz_passed=True,
                        best_quiz_score=15,
                        best_quiz_percentage=100.0,
                        xp_earned=100
                    )
                    db.add(progress)
                print("Added B2 progress for superadmin")
            
            print("Superadmin already exists, updated current_lesson_id")
        
        # Check if regular user exists
        regular_user = db.query(User).filter(User.username == "user").first()
        if not regular_user:
            regular_user = User(
                username="user",
                email="user@bosanski.ba",
                full_name="Test User",
                hashed_password=get_password_hash("user123"),
                current_lesson_id=1,  # Start from lesson 1
                total_xp=0,
                current_level=1
            )
            db.add(regular_user)
            print("Created regular user")
        else:
            print("Regular user already exists")
        
        db.commit()
        print("Seed completed successfully!")
        print("  - superadmin / superadmin123 (all lessons unlocked)")
        print("  - user / user123 (regular user)")
        
    except Exception as e:
        print(f"Error seeding users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
