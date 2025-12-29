#!/usr/bin/env python3
"""
Generate images for vocabulary words using Google Gemini AI (Imagen).
This script uses the Google GenAI SDK to generate images for lesson vocabulary.

Usage:
    1. Set GOOGLE_API_KEY environment variable (or in .env)
    2. Run: python generate_images_gemini.py

Requirements:
    pip install google-genai pillow python-dotenv
"""

import os
import json
import hashlib
import time
import base64
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
load_dotenv()

try:
    from google import genai
    from google.genai import types
    from PIL import Image
    from io import BytesIO
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    print("Note: google-genai not installed. Run: pip install google-genai")

# Import lesson data
from app.data.a1_lessons import A1_LESSONS
from app.data.a1_lessons_2 import A1_LESSONS_PART2
from app.data.a1_lessons_3 import A1_LESSONS_PART3
from app.data.a1_lessons_4 import A1_LESSONS_PART4

ALL_LESSONS = A1_LESSONS + A1_LESSONS_PART2 + A1_LESSONS_PART3 + A1_LESSONS_PART4

# Configuration
OUTPUT_DIR = Path("static/images/vocabulary")
MANIFEST_FILE = OUTPUT_DIR / "manifest.json"

# Bosnia-themed color palette for prompts
BOSNIA_STYLE = """
Style: Modern, clean illustration with a warm, inviting feel.
Color palette: Use soft blue (#002395 bosnia blue), golden yellow (#FECB00), 
and warm neutral tones. The image should feel educational and friendly.
Background: Simple, clean gradient or solid color.
"""

def setup_genai_client():
    """Configure Google GenAI client for Imagen."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY environment variable not set")
        print("Get your API key from: https://aistudio.google.com/app/apikey")
        return None
    
    if not GENAI_AVAILABLE:
        print("Error: google-genai package not installed")
        return None
    
    try:
        client = genai.Client(api_key=api_key)
        return client
    except Exception as e:
        print(f"Error initializing client: {e}")
        return None

def generate_filename(word: str) -> str:
    """Generate a safe filename from a word."""
    # Create hash for uniqueness
    word_hash = hashlib.md5(word.encode()).hexdigest()[:8]
    # Sanitize word for filename
    safe_word = "".join(c if c.isalnum() else "_" for c in word.lower())
    return f"{safe_word}_{word_hash}.png"

def create_image_prompt(bosnian_word: str, english_word: str, example: str = None) -> str:
    """Create a detailed prompt for image generation."""
    prompt = f"""
Create a simple, educational illustration for the Bosnian word "{bosnian_word}" 
which means "{english_word}" in English.

{BOSNIA_STYLE}

Requirements:
- The image should clearly represent the concept of "{english_word}"
- No text or words in the image
- Simple, iconic representation
- Suitable for language learning
- Clean and modern design
- 512x512 pixels
"""
    if example:
        prompt += f"\nContext: Used in the sentence '{example}'"
    
    return prompt

def load_manifest() -> dict:
    """Load existing manifest or create new one."""
    if MANIFEST_FILE.exists():
        with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_manifest(manifest: dict):
    """Save manifest to file."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

def collect_vocabulary_words() -> list:
    """Collect all vocabulary words from lessons."""
    words = []
    
    for lesson in ALL_LESSONS:
        lesson_id = lesson.get('id', 0)
        vocabulary = lesson.get('vocabulary', [])
        
        for word in vocabulary:
            words.append({
                'lesson_id': lesson_id,
                'bosnian': word.get('bosnian', ''),
                'english': word.get('english', ''),
                'example': word.get('example', ''),
                'emoji': word.get('image_emoji', '')
            })
    
    return words

def generate_placeholder_svg(word: str, emoji: str) -> str:
    """Generate a placeholder SVG for words without AI-generated images."""
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#002395;stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#FECB00;stop-opacity:0.1" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bg)" rx="24"/>
  <text x="128" y="100" font-size="64" text-anchor="middle">{emoji or '📚'}</text>
  <text x="128" y="160" font-size="16" font-family="Arial, sans-serif" text-anchor="middle" fill="#002395" font-weight="bold">{word[:15]}</text>
</svg>'''
    return svg

def generate_image_with_gemini(client, prompt: str, filepath: Path) -> bool:
    """Generate image using Gemini Flash Image model."""
    try:
        # Use the dedicated image generation model
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp-image-generation',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=['IMAGE', 'TEXT'],
            )
        )
        
        # Extract image from response
        if response.candidates:
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    image_data = base64.b64decode(part.inline_data.data)
                    image = Image.open(BytesIO(image_data))
                    image.save(filepath)
                    return True
        return False
    except Exception as e:
        print(f"   ⚠️ Error: {e}")
        return False

def main():
    """Main function to generate images."""
    print("=" * 60)
    print("🇧🇦 Gemini AI Image Generator for Bosanski Jezik")
    print("=" * 60)
    
    # Setup output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Load existing manifest
    manifest = load_manifest()
    
    # Collect vocabulary words
    words = collect_vocabulary_words()
    print(f"\n📚 Found {len(words)} vocabulary words across all lessons")
    
    # Check for GenAI client
    client = setup_genai_client()
    use_ai = client is not None
    
    if not use_ai:
        print("\n⚠️  Running in placeholder mode (no AI generation)")
        print("   Install: pip install google-genai")
        print("   Set GOOGLE_API_KEY to enable AI image generation")
    else:
        print("\n✅ Imagen 3 AI ready for image generation")
    
    # Process words
    generated = 0
    ai_generated = 0
    skipped = 0
    errors = 0
    
    for i, word in enumerate(words):
        bosnian = word['bosnian']
        english = word['english']
        emoji = word['emoji']
        
        # Check if already generated
        if bosnian in manifest:
            skipped += 1
            continue
        
        filename = generate_filename(bosnian)
        filepath = OUTPUT_DIR / filename
        
        print(f"\n[{i+1}/{len(words)}] {bosnian} ({english})")
        
        if use_ai:
            prompt = create_image_prompt(bosnian, english)
            print(f"   🎨 Generating with Gemini...")
            
            success = generate_image_with_gemini(client, prompt, filepath)
            
            if success:
                print(f"   ✅ Saved: {filename}")
                manifest[bosnian] = {
                    'filename': filename,
                    'english': english,
                    'emoji': emoji,
                    'type': 'ai_generated'
                }
                ai_generated += 1
                # Rate limiting - be gentle with API
                time.sleep(2)
            else:
                # Fallback to placeholder
                print(f"   → Using placeholder")
                svg_content = generate_placeholder_svg(bosnian, emoji)
                svg_path = OUTPUT_DIR / f"{filename.replace('.png', '.svg')}"
                with open(svg_path, 'w', encoding='utf-8') as f:
                    f.write(svg_content)
                
                manifest[bosnian] = {
                    'filename': f"{filename.replace('.png', '.svg')}",
                    'english': english,
                    'emoji': emoji,
                    'type': 'placeholder'
                }
                errors += 1
        else:
            # Generate placeholder SVG
            svg_content = generate_placeholder_svg(bosnian, emoji)
            svg_path = OUTPUT_DIR / f"{filename.replace('.png', '.svg')}"
            with open(svg_path, 'w', encoding='utf-8') as f:
                f.write(svg_content)
            
            manifest[bosnian] = {
                'filename': f"{filename.replace('.png', '.svg')}",
                'english': english,
                'emoji': emoji,
                'type': 'placeholder'
            }
        
        generated += 1
        
        # Save manifest periodically
        if generated % 10 == 0:
            save_manifest(manifest)
    
    # Final save
    save_manifest(manifest)
    
    print("\n" + "=" * 60)
    print("🎉 Generation Complete!")
    print(f"  📊 Total processed: {generated}")
    print(f"  🎨 AI generated: {ai_generated}")
    print(f"  ⏭️  Skipped (exists): {skipped}")
    print(f"  ⚠️  Errors/fallback: {errors}")
    print(f"  📁 Output: {OUTPUT_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
