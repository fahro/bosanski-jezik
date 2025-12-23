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
    return []

@app.get("/api/lessons/{lesson_id}")
def get_lesson(lesson_id: int):
    for lesson in A1_LESSONS:
        if lesson["id"] == lesson_id:
            return lesson
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
for audio_path in ["/app/static/audio", os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "audio")]:
    if os.path.exists(audio_path):
        AUDIO_DIR = audio_path
        break
AUDIO_MANIFEST = {}

def load_audio_manifest():
    global AUDIO_MANIFEST
    if AUDIO_DIR:
        manifest_path = os.path.join(AUDIO_DIR, "manifest.json")
        if os.path.exists(manifest_path):
            with open(manifest_path, 'r', encoding='utf-8') as f:
                AUDIO_MANIFEST = json.load(f)

load_audio_manifest()

# Mount static audio directory
if AUDIO_DIR and os.path.exists(AUDIO_DIR):
    app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")

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
