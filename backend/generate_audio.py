#!/usr/bin/env python3
"""
Script to generate audio files for all vocabulary words and examples.
Requires OPENAI_API_KEY environment variable to be set.
"""

import os
import re
import hashlib
import json
import unicodedata
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Import lesson data
from app.data.a1_lessons import A1_LESSONS

AUDIO_DIR = Path(__file__).parent / "static" / "audio"
MANIFEST_FILE = AUDIO_DIR / "manifest.json"

def sanitize_filename(text: str, max_length: int = 50) -> str:
    """
    Convert text to a safe filename.
    - Remove special characters
    - Replace spaces with underscores
    - Transliterate Bosnian characters
    - Limit length
    """
    # Transliterate Bosnian/Serbian special characters
    replacements = {
        'č': 'c', 'ć': 'c', 'š': 's', 'ž': 'z', 'đ': 'dj',
        'Č': 'C', 'Ć': 'C', 'Š': 'S', 'Ž': 'Z', 'Đ': 'Dj'
    }
    for bos, lat in replacements.items():
        text = text.replace(bos, lat)
    
    # Remove accents from other characters
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('ASCII')
    
    # Replace spaces and special chars with underscores
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s]+', '_', text)
    
    # Lowercase and trim
    text = text.lower().strip('_')
    
    # Limit length
    if len(text) > max_length:
        text = text[:max_length].rstrip('_')
    
    return text

def get_audio_filename(text: str) -> str:
    """Generate a readable filename based on text content."""
    safe_name = sanitize_filename(text)
    # Add short hash suffix to ensure uniqueness
    text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()[:6]
    return f"{safe_name}_{text_hash}.mp3"

def generate_audio(client: OpenAI, text: str, output_path: Path) -> bool:
    """Generate audio file using OpenAI TTS with optimized settings."""
    if output_path.exists():
        print(f"  ✓ Already exists: {output_path.name}")
        return True
    
    try:
        response = client.audio.speech.create(
            model="tts-1-hd",      # HD model za bolji kvalitet
            voice="nova",          # Nova glas bolje izgovara strane jezike
            input=text,            # Direktno tekst bez prefiksa
            speed=0.9              # Malo sporije za jasniji izgovor
        )
        
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        print(f"  ✓ Generated: {output_path.name} - '{text[:50]}...'")
        return True
    except Exception as e:
        print(f"  ✗ Error for '{text[:30]}...': {e}")
        return False

def extract_bosnian_text(text: str) -> str:
    """Extract only Bosnian text, removing English translations and other noise."""
    if not text:
        return ""
    # Skip if it looks like English only
    if text.startswith("How ") or text.startswith("What ") or text.startswith("The "):
        return ""
    return text.strip()

def main():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("ERROR: OPENAI_API_KEY environment variable not set!")
        print("Create a .env file with: OPENAI_API_KEY=your-key-here")
        return
    
    client = OpenAI(api_key=api_key)
    
    # Create audio directory
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    
    # Collect all texts to generate
    texts_to_generate = []
    manifest = {}
    
    print("Collecting all Bosnian text from lessons...")
    
    for lesson in A1_LESSONS:
        lesson_id = lesson["id"]
        print(f"\nLesson {lesson_id}: {lesson['title']}")
        
        # 1. Vocabulary words and examples
        for word in lesson.get("vocabulary", []):
            bosnian = word.get("bosnian", "")
            example = word.get("example", "")
            
            if bosnian:
                texts_to_generate.append(bosnian)
            if example:
                texts_to_generate.append(example)
        
        # 2. Dialogue lines
        for line in lesson.get("dialogue", []):
            text = line.get("text", "")
            if text:
                texts_to_generate.append(text)
        
        # 3. Quiz questions and options (Bosnian parts only)
        for quiz in lesson.get("quiz", []):
            question = quiz.get("question", "")
            # Only add if question is in Bosnian (contains Bosnian characters or patterns)
            if question and ("Kako" in question or "Koja" in question or "Šta" in question or "Koji" in question):
                texts_to_generate.append(question)
            # Add Bosnian options
            for option in quiz.get("options", []):
                # Skip English-only options
                if option and not option[0].isupper() or any(c in option for c in "čćšžđČĆŠŽĐ"):
                    texts_to_generate.append(option)
        
        # 4. Exercises - fill in blank sentences, matching pairs, etc.
        for exercise in lesson.get("exercises", []):
            content = exercise.get("content", {})
            
            # Fill blank sentences
            sentence = content.get("sentence", "")
            if sentence:
                # Replace blank with the answer for full sentence
                answer = exercise.get("answer", "")
                full_sentence = sentence.replace("_____", answer).replace("___", answer)
                texts_to_generate.append(full_sentence)
            
            # Matching pairs - Bosnian words
            pairs = content.get("pairs", [])
            for pair in pairs:
                if isinstance(pair, list) and len(pair) > 0:
                    texts_to_generate.append(pair[0])  # First item is usually Bosnian
            
            # Translation text
            trans_text = content.get("text", "")
            if trans_text:
                texts_to_generate.append(trans_text)
        
        # 5. Cultural notes
        cultural_note = lesson.get("cultural_note", "")
        if cultural_note:
            # Split into sentences for better audio
            sentences = re.split(r'[.!?]+', cultural_note)
            for sentence in sentences:
                sentence = sentence.strip()
                if sentence and len(sentence) > 10:
                    texts_to_generate.append(sentence)
        
        # 6. Cultural comic panels
        cultural_comic = lesson.get("cultural_comic", {})
        for panel in cultural_comic.get("panels", []):
            panel_text = panel.get("text", "")
            if panel_text:
                texts_to_generate.append(panel_text)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_texts = []
    for text in texts_to_generate:
        text = extract_bosnian_text(text)
        if text and text not in seen and len(text) > 1:
            seen.add(text)
            unique_texts.append(text)
    
    print(f"\nTotal unique texts to generate: {len(unique_texts)}")
    print("=" * 50)
    
    # Generate audio files
    success_count = 0
    for i, text in enumerate(unique_texts, 1):
        filename = get_audio_filename(text)
        output_path = AUDIO_DIR / filename
        
        print(f"[{i}/{len(unique_texts)}]", end="")
        if generate_audio(client, text, output_path):
            manifest[text] = filename
            success_count += 1
    
    # Save manifest
    with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 50)
    print(f"Done! Generated {success_count}/{len(unique_texts)} audio files.")
    print(f"Audio files saved to: {AUDIO_DIR}")
    print(f"Manifest saved to: {MANIFEST_FILE}")

if __name__ == "__main__":
    main()
