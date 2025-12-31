from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Use Railway volume (/data) if available, otherwise local data folder
railway_volume = "/data"
if os.path.isdir(railway_volume):
    data_dir = railway_volume
else:
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
os.makedirs(data_dir, exist_ok=True)
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{data_dir}/bosanski.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def run_migrations():
    """Run database migrations to add missing columns."""
    with engine.connect() as conn:
        # Check and add missing columns to lesson_progress table
        try:
            # Get existing columns
            result = conn.execute(text("PRAGMA table_info(lesson_progress)"))
            existing_columns = {row[1] for row in result.fetchall()}
            
            # Add saved_tab if missing
            if 'saved_tab' not in existing_columns:
                conn.execute(text("ALTER TABLE lesson_progress ADD COLUMN saved_tab VARCHAR"))
                print("Migration: Added saved_tab column")
            
            # Add saved_exercise_type if missing
            if 'saved_exercise_type' not in existing_columns:
                conn.execute(text("ALTER TABLE lesson_progress ADD COLUMN saved_exercise_type VARCHAR"))
                print("Migration: Added saved_exercise_type column")
            
            # Add level column if missing (for multi-level support: a1, a2, b1, etc.)
            if 'level' not in existing_columns:
                conn.execute(text("ALTER TABLE lesson_progress ADD COLUMN level VARCHAR(10) DEFAULT 'a1'"))
                print("Migration: Added level column")
            
            conn.commit()
        except Exception as e:
            print(f"Migration note: {e}")
