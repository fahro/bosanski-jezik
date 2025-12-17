from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json

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

@app.get("/")
def read_root():
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
