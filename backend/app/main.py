from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Bosanski Jezik - Learn Bosnian", version="1.0.0")

# Initialize database
from app.database import engine, Base, run_migrations
from app.models import User, LessonProgress, QuizAttempt, FinalTestAttempt
Base.metadata.create_all(bind=engine)

# Run database migrations for existing databases
run_migrations()

# Seed initial users
from app.seed import seed_users
seed_users()

# Include routers
from app.routes.auth import router as auth_router
from app.routes.progress import router as progress_router
from app.routes.final_test import router as final_test_router

app.include_router(auth_router)
app.include_router(progress_router)
app.include_router(final_test_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VocabularyItem(BaseModel):
    bosnian: str
    english: str
    pronunciation: str
    example: str
    example_translation: str
    image_emoji: str

class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: int
    explanation: str
    question_type: str

class Exercise(BaseModel):
    id: int
    type: str
    instruction: str
    content: dict
    answer: str
    hint: str

class Lesson(BaseModel):
    id: int
    title: str
    description: str
    level: str
    module: int
    objectives: List[str]
    vocabulary: List[VocabularyItem]
    grammar_explanation: str
    cultural_note: str
    dialogue: List[dict]
    exercises: List[Exercise]
    quiz: List[QuizQuestion]

class Level(BaseModel):
    id: str
    name: str
    description: str
    total_lessons: int
    color: str

from app.data.levels import LEVELS
from app.data.a1_lessons import A1_LESSONS
from app.data.a2_lessons import A2_LESSONS
from app.data.b1_lessons import B1_LESSONS
from app.data.b1_lessons_2 import B1_LESSONS_PART2
from app.data.b1_lessons_3 import B1_LESSONS_PART3
from app.data.b2_lessons import B2_LESSONS

# Combine B1 lessons
B1_ALL_LESSONS = B1_LESSONS + B1_LESSONS_PART2 + B1_LESSONS_PART3

# Check for static directory at startup
STATIC_DIR = None
for dir_path in ["/app/static", os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")]:
    if os.path.exists(dir_path) and os.path.isdir(dir_path):
        STATIC_DIR = dir_path
        break

@app.get("/")
def read_root():
    # Serve frontend if static files exist
    if STATIC_DIR:
        index_path = os.path.join(STATIC_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
    return {"message": "Dobrodošli! Welcome to Bosnian Language Learning API"}

@app.get("/api/levels", response_model=List[Level])
def get_levels():
    return LEVELS

@app.get("/api/levels/{level_id}")
def get_level(level_id: str):
    for level in LEVELS:
        if level["id"] == level_id:
            return level
    raise HTTPException(status_code=404, detail="Level not found")

@app.get("/api/levels/{level_id}/lessons")
def get_lessons_by_level(level_id: str):
    if level_id == "a1":
        return A1_LESSONS
    elif level_id == "a2":
        return A2_LESSONS
    elif level_id == "b1":
        return B1_ALL_LESSONS
    elif level_id == "b2":
        return B2_LESSONS
    return []

@app.get("/api/lessons/{lesson_id}")
def get_lesson(lesson_id: int, level: str = "a1"):
    if level == "a1":
        lessons = A1_LESSONS
    elif level == "a2":
        lessons = A2_LESSONS
    elif level == "b1":
        lessons = B1_ALL_LESSONS
    elif level == "b2":
        lessons = B2_LESSONS
    else:
        lessons = []
    for lesson in lessons:
        if lesson["id"] == lesson_id:
            enriched_lesson = lesson.copy()
            lesson_title = lesson.get("title", "")
            
            # Enrich vocabulary with image URLs
            if "vocabulary" in enriched_lesson:
                enriched_vocab = []
                for word in enriched_lesson["vocabulary"]:
                    word_copy = word.copy()
                    bosnian = word.get("bosnian", "")
                    if bosnian in IMAGE_MANIFEST:
                        img_info = IMAGE_MANIFEST[bosnian]
                        if img_info.get('type') == 'ai_generated':
                            word_copy["image_url"] = f"/images/vocabulary/{img_info['filename']}"
                    enriched_vocab.append(word_copy)
                enriched_lesson["vocabulary"] = enriched_vocab
            
            # Add culture image URL
            culture_key = f"Kultura - {lesson_title}"
            if culture_key in CULTURE_MANIFEST:
                img_info = CULTURE_MANIFEST[culture_key]
                if img_info.get('type') == 'ai_generated':
                    enriched_lesson["culture_image_url"] = f"/images/culture/{img_info['filename']}"
            
            # Add dialogue image URL
            dialogue_key = f"Dijalog - {lesson_title}"
            if dialogue_key in DIALOGUE_MANIFEST:
                img_info = DIALOGUE_MANIFEST[dialogue_key]
                if img_info.get('type') == 'ai_generated':
                    enriched_lesson["dialogue_image_url"] = f"/images/dialogue/{img_info['filename']}"
            
            # Enrich cultural_comic with generated images
            if "cultural_comic" in enriched_lesson:
                comic = enriched_lesson["cultural_comic"].copy()
                comic_title = comic.get("title", "")
                
                # Add comic background image URL
                comic_key = f"Comic - {comic_title}"
                if comic_key in COMIC_BG_MANIFEST:
                    img_info = COMIC_BG_MANIFEST[comic_key]
                    if img_info.get('type') == 'ai_generated':
                        comic["generated_image"] = f"/images/comic_backgrounds/{img_info['filename']}"
                
                # Enrich panels with avatar URLs
                if "panels" in comic:
                    enriched_panels = []
                    for panel in comic["panels"]:
                        panel_copy = panel.copy()
                        name = panel.get("name", "")
                        avatar_key = f"Avatar - {name}"
                        if avatar_key in AVATAR_MANIFEST:
                            img_info = AVATAR_MANIFEST[avatar_key]
                            if img_info.get('type') == 'ai_generated':
                                panel_copy["generated_avatar"] = f"/images/avatars/{img_info['filename']}"
                        enriched_panels.append(panel_copy)
                    comic["panels"] = enriched_panels
                
                enriched_lesson["cultural_comic"] = comic
            
            return enriched_lesson
    raise HTTPException(status_code=404, detail="Lesson not found")

@app.post("/api/quiz/check")
def check_answer(data: dict):
    return {
        "correct": data.get("selected") == data.get("correct_answer"),
        "correct_answer": data.get("correct_answer")
    }

# Load audio manifest for pre-generated audio files
import hashlib

# Support both local development and Docker paths
AUDIO_DIR = None
IMAGES_DIR = None
STATIC_BASE = None
for base_path in ["/app/static", os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")]:
    if os.path.exists(base_path):
        STATIC_BASE = base_path
        AUDIO_DIR = os.path.join(base_path, "audio")
        IMAGES_DIR = os.path.join(base_path, "images", "vocabulary")
        CULTURE_DIR = os.path.join(base_path, "images", "culture")
        DIALOGUE_DIR = os.path.join(base_path, "images", "dialogue")
        COMIC_BG_DIR = os.path.join(base_path, "images", "comic_backgrounds")
        AVATAR_DIR = os.path.join(base_path, "images", "avatars")
        break

AUDIO_MANIFEST = {}
IMAGE_MANIFEST = {}
CULTURE_MANIFEST = {}
DIALOGUE_MANIFEST = {}
COMIC_BG_MANIFEST = {}
AVATAR_MANIFEST = {}

def load_audio_manifest():
    global AUDIO_MANIFEST
    if AUDIO_DIR:
        manifest_path = os.path.join(AUDIO_DIR, "manifest.json")
        if os.path.exists(manifest_path):
            with open(manifest_path, 'r', encoding='utf-8') as f:
                AUDIO_MANIFEST = json.load(f)

def load_image_manifest():
    global IMAGE_MANIFEST, CULTURE_MANIFEST, DIALOGUE_MANIFEST, COMIC_BG_MANIFEST, AVATAR_MANIFEST
    if IMAGES_DIR:
        manifest_path = os.path.join(IMAGES_DIR, "manifest.json")
        if os.path.exists(manifest_path):
            with open(manifest_path, 'r', encoding='utf-8') as f:
                IMAGE_MANIFEST = json.load(f)
    if CULTURE_DIR:
        manifest_path = os.path.join(CULTURE_DIR, "manifest.json")
        if os.path.exists(manifest_path):
            with open(manifest_path, 'r', encoding='utf-8') as f:
                CULTURE_MANIFEST = json.load(f)
    if DIALOGUE_DIR:
        manifest_path = os.path.join(DIALOGUE_DIR, "manifest.json")
        if os.path.exists(manifest_path):
            with open(manifest_path, 'r', encoding='utf-8') as f:
                DIALOGUE_MANIFEST = json.load(f)
    if COMIC_BG_DIR:
        manifest_path = os.path.join(COMIC_BG_DIR, "manifest.json")
        if os.path.exists(manifest_path):
            with open(manifest_path, 'r', encoding='utf-8') as f:
                COMIC_BG_MANIFEST = json.load(f)
    if AVATAR_DIR:
        manifest_path = os.path.join(AVATAR_DIR, "manifest.json")
        if os.path.exists(manifest_path):
            with open(manifest_path, 'r', encoding='utf-8') as f:
                AVATAR_MANIFEST = json.load(f)

load_audio_manifest()
load_image_manifest()

# Mount static directories
if AUDIO_DIR and os.path.exists(AUDIO_DIR):
    app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")

# Mount static images directory
STATIC_IMAGES_BASE = None
for base_path in ["/app/static/images", os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "images")]:
    if os.path.exists(base_path):
        STATIC_IMAGES_BASE = base_path
        break
if STATIC_IMAGES_BASE:
    app.mount("/images", StaticFiles(directory=STATIC_IMAGES_BASE), name="images")

@app.get("/api/audio/{text:path}")
async def get_audio_url(text: str):
    """Get the URL for a pre-generated audio file."""
    if text in AUDIO_MANIFEST:
        filename = AUDIO_MANIFEST[text]
        return {"url": f"/audio/{filename}", "exists": True}
    
    # Generate filename hash for fallback check
    text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()[:12]
    filename = f"{text_hash}.mp3"
    file_path = os.path.join(AUDIO_DIR, filename)
    
    if os.path.exists(file_path):
        return {"url": f"/audio/{filename}", "exists": True}
    
    return {"url": None, "exists": False}

class TTSRequest(BaseModel):
    text: str
    voice: str = "alloy"

@app.post("/api/tts")
async def text_to_speech(request: TTSRequest):
    """Generate audio on-the-fly (fallback if pre-generated not available)."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        client = OpenAI(api_key=api_key)
        response = client.audio.speech.create(
            model="tts-1",
            voice=request.voice,
            input=request.text
        )
        
        audio_content = response.content
        return Response(
            content=audio_content,
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=speech.mp3"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve static frontend files (for production deployment)
if STATIC_DIR:
    assets_dir = os.path.join(STATIC_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Don't serve frontend for API routes
        if full_path.startswith("api/"):
            return {"error": "Not found"}
        file_path = os.path.join(STATIC_DIR, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_path = os.path.join(STATIC_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
