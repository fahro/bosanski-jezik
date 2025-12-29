#!/usr/bin/env python3
"""
Generate images for vocabulary, culture, and dialogues using Google Gemini AI.
This script uses the Google GenAI SDK to generate images for all lesson content.

Usage:
    1. Set GOOGLE_API_KEY environment variable (or in .env)
    2. Run: python generate_images_gemini.py [--force]

Requirements:
    pip install google-genai pillow python-dotenv
"""

import os
import sys
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
CULTURE_DIR = Path("static/images/culture")
DIALOGUE_DIR = Path("static/images/dialogue")
COMIC_BG_DIR = Path("static/images/comic_backgrounds")
AVATAR_DIR = Path("static/images/avatars")
MANIFEST_FILE = OUTPUT_DIR / "manifest.json"
CULTURE_MANIFEST = CULTURE_DIR / "manifest.json"
DIALOGUE_MANIFEST = DIALOGUE_DIR / "manifest.json"
COMIC_BG_MANIFEST = COMIC_BG_DIR / "manifest.json"
AVATAR_MANIFEST = AVATAR_DIR / "manifest.json"

# Check for command line flags
FORCE_REGENERATE = "--force" in sys.argv
REGENERATE_PLACEHOLDERS = "--regenerate-placeholders" in sys.argv or "-rp" in sys.argv

# High-quality style for prompts
QUALITY_STYLE = """
Art style: High-quality digital illustration, trending on ArtStation and Dribbble.
Rendering: Soft lighting, subtle shadows, clean crisp edges, professional quality.
Color palette: Harmonious warm tones with Bosnia blue (#002395) and golden yellow (#FECB00) accents.
Composition: Centered subject, balanced negative space, visually appealing.
Quality: 4K resolution quality, highly detailed, photorealistic elements where appropriate.
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
    """Create a detailed prompt for high-quality image generation."""
    prompt = f"""
Create a stunning, professional illustration representing "{english_word}".

{QUALITY_STYLE}

Subject: A beautiful, detailed representation of "{english_word}" - make it visually striking and memorable.
Atmosphere: Warm, inviting, and educational - perfect for language learning.
Technical: High resolution, sharp details, professional digital art quality.

IMPORTANT:
- NO text, words, letters, or writing anywhere in the image
- Focus on visual representation only
- Make it aesthetically pleasing and modern
- Use rich colors and professional lighting
"""
    if example:
        prompt += f"\nContext hint: {example}"
    
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

def collect_culture_items() -> list:
    """Collect all cultural notes from lessons."""
    items = []
    
    for lesson in ALL_LESSONS:
        lesson_id = lesson.get('id', 0)
        lesson_title = lesson.get('title', '')
        cultural_note = lesson.get('cultural_note', '')
        
        # Cultural note is a string describing Bosnian culture
        if cultural_note and isinstance(cultural_note, str):
            items.append({
                'lesson_id': lesson_id,
                'lesson_title': lesson_title,
                'title': f"Kultura - {lesson_title}",
                'content': cultural_note,
                'facts': []
            })
    
    return items

def collect_dialogue_items() -> list:
    """Collect all dialogues from lessons."""
    items = []
    
    for lesson in ALL_LESSONS:
        lesson_id = lesson.get('id', 0)
        lesson_title = lesson.get('title', '')
        dialogue = lesson.get('dialogue', [])
        
        # Dialogue is a list of speaker lines, create one image per lesson
        if dialogue and isinstance(dialogue, list) and len(dialogue) > 0:
            # Extract context from the dialogue
            first_line = dialogue[0].get('text', '') if isinstance(dialogue[0], dict) else ''
            items.append({
                'lesson_id': lesson_id,
                'lesson_title': lesson_title,
                'title': f"Dijalog - {lesson_title}",
                'setting': lesson_title,
                'context': first_line
            })
    
    return items

def collect_comic_backgrounds() -> list:
    """Collect all cultural comic backgrounds from lessons."""
    items = []
    
    for lesson in ALL_LESSONS:
        lesson_id = lesson.get('id', 0)
        lesson_title = lesson.get('title', '')
        cultural_comic = lesson.get('cultural_comic', {})
        
        if cultural_comic and isinstance(cultural_comic, dict):
            comic_title = cultural_comic.get('title', '')
            panels = cultural_comic.get('panels', [])
            
            # Get unique character names for the scene
            characters = []
            for panel in panels:
                name = panel.get('name', '')
                if name and name not in characters:
                    characters.append(name)
            
            items.append({
                'lesson_id': lesson_id,
                'lesson_title': lesson_title,
                'title': f"Comic - {comic_title}",
                'comic_title': comic_title,
                'characters': characters[:2]  # Max 2 main characters
            })
    
    return items

def collect_character_avatars() -> list:
    """Collect all unique character avatars from cultural comics."""
    characters = {}
    
    for lesson in ALL_LESSONS:
        cultural_comic = lesson.get('cultural_comic', {})
        
        if cultural_comic and isinstance(cultural_comic, dict):
            panels = cultural_comic.get('panels', [])
            
            for panel in panels:
                name = panel.get('name', '')
                position = panel.get('position', 'left')
                
                if name and name not in characters:
                    # Determine character type based on name/context
                    is_shopkeeper = any(k in name.lower() for k in ['dućandžija', 'prodavač', 'konobar', 'kuhar', 'doktor'])
                    is_female = any(k in name.lower() for k in ['a', 'ica']) and name[-1] == 'a'
                    
                    characters[name] = {
                        'name': name,
                        'title': f"Avatar - {name}",
                        'is_shopkeeper': is_shopkeeper,
                        'is_female': is_female,
                        'position': position
                    }
    
    return list(characters.values())

def create_culture_prompt(title: str, content: str, facts: list) -> str:
    """Create prompt for high-quality culture image."""
    return f"""
Create a breathtaking, cinematic illustration showcasing Bosnian culture: "{title}"

{QUALITY_STYLE}

Scene: A visually stunning representation of {title} in Bosnia and Herzegovina.
Include authentic elements: traditional Bosnian architecture (Ottoman style), 
beautiful landscapes, cultural symbols, or traditional items.

Atmosphere: Golden hour lighting, warm and nostalgic feel, pride in heritage.
Style: Like a beautiful travel photography or National Geographic illustration.

IMPORTANT:
- NO text, words, or letters in the image
- Make it magazine-cover quality
- Rich, vibrant colors with professional composition
- Evoke emotion and cultural pride
"""

def create_dialogue_prompt(title: str, setting: str) -> str:
    """Create prompt for high-quality dialogue scene."""
    return f"""
Create a warm, inviting scene illustration for: "{title}"
Setting: {setting}

{QUALITY_STYLE}

Scene: A cozy, atmospheric {setting or 'social setting'} in Bosnia.
Include: Beautiful interior or exterior scene, warm lighting, inviting atmosphere.
Style: Like a frame from a Pixar movie or high-end animation - warm and welcoming.

Mood: Friendly, conversational, makes you want to be there.

IMPORTANT:
- NO text, speech bubbles, or writing
- NO visible faces (use silhouettes or back views if people needed)
- Focus on the environment and atmosphere
- Professional illustration quality
"""

def create_comic_background_prompt(comic_title: str, characters: list) -> str:
    """Create prompt for cultural comic background scene."""
    char_desc = " and ".join(characters) if characters else "local people"
    
    # Determine setting from title
    setting_hints = {
        'Baščaršij': 'the historic Baščaršija bazaar in Sarajevo with Ottoman architecture, copper shops, and cobblestone streets',
        'Sebilj': 'the iconic Sebilj wooden fountain in the heart of Baščaršija, Sarajevo',
        'Most': 'the famous Stari Most (Old Bridge) in Mostar over the emerald Neretva river',
        'Univerzitet': 'the University of Sarajevo campus with historic academic buildings',
        'željeznič': 'the historic Sarajevo railway station with its distinctive architecture',
        'Ferhadija': 'the bustling Ferhadija pedestrian street in Sarajevo center',
        'pijac': 'a traditional Bosnian outdoor market (pijaca) with fresh produce and local vendors',
        'kafan': 'a traditional Bosnian kafana (tavern) with warm wooden interior',
        'ćevabdžinic': 'a cozy Bosnian ćevabdžinica restaurant with grills and traditional decor',
        'stan': 'a warm Bosnian apartment interior with traditional elements',
        'doktor': 'a clean, welcoming doctor\'s office or clinic',
        'nana': 'a cozy grandmother\'s traditional Bosnian home with warm hospitality',
        'Jahorina': 'the beautiful Jahorina mountain with snow-capped peaks and forests'
    }
    
    setting = 'a beautiful location in Bosnia and Herzegovina'
    for key, desc in setting_hints.items():
        if key.lower() in comic_title.lower():
            setting = desc
            break
    
    return f"""
Create a stunning, cinematic wide-angle illustration of {setting}.

{QUALITY_STYLE}

Scene requirements:
- Show TWO Bosnian people ({char_desc}) in traditional or smart casual clothing having a friendly conversation
- Characters should be clearly visible, facing each other or slightly towards the viewer
- One person on the LEFT side, one person on the RIGHT side of the scene
- Warm, golden hour lighting creating an inviting atmosphere
- Rich details of Bosnian architecture and culture in the background

Character style:
- Friendly, approachable expressions
- Modern Bosnian people (not historical/ancient)
- Natural poses, mid-conversation
- Clear silhouettes that work well as scene setting

Art style: Like a beautiful frame from a Pixar or DreamWorks animated film.
Mood: Warm, friendly, cultural pride, welcoming.

IMPORTANT:
- NO text, labels, or speech bubbles
- NO watermarks or signatures
- Characters must be clearly visible and well-lit
- Professional cinematic composition
"""

def create_avatar_prompt(name: str, is_female: bool, is_shopkeeper: bool) -> str:
    """Create prompt for character avatar."""
    gender = "woman" if is_female else "man"
    
    if is_shopkeeper:
        role_desc = f"a friendly Bosnian {gender} shopkeeper or service worker"
        clothing = "wearing a traditional apron or work attire, looking professional and welcoming"
    else:
        role_desc = f"a young Bosnian {gender}"
        clothing = "wearing modern casual clothing with subtle traditional Bosnian elements"
    
    return f"""
Create a portrait avatar of {role_desc} named {name}.

Style: High-quality digital art portrait, like a character from a Pixar or DreamWorks animated movie.
- Circular portrait composition (head and shoulders)
- Warm, friendly expression with a slight smile
- {clothing}
- Soft, professional lighting from the front
- Clean background (solid warm color or subtle gradient)

Character features:
- Friendly, approachable face
- Natural skin tones
- Modern Bosnian person (Mediterranean/Balkan features)
- Well-groomed, professional appearance

IMPORTANT:
- NO text or labels
- Portrait should work well as a small circular avatar (64x64 to 128x128 pixels)
- Clear, recognizable face
- Warm and inviting expression
"""

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
    """Generate high-quality image using Gemini 3 Pro Image model."""
    try:
        # Use Gemini 3 Pro Image for free high-quality image generation
        response = client.models.generate_content(
            model='gemini-3-pro-image-preview',
            contents=f"Generate this image: {prompt}",
            config=types.GenerateContentConfig(
                response_modalities=['IMAGE', 'TEXT'],
            )
        )
        
        # Extract and save image from response
        if response.candidates:
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    try:
                        image_data = part.inline_data.data
                        if isinstance(image_data, str):
                            image_data = base64.b64decode(image_data)
                        image = Image.open(BytesIO(image_data))
                        image.save(filepath)
                        return True
                    except Exception as img_err:
                        print(f"      ⚠️ Image decode error: {str(img_err)[:50]}")
        return False
    except Exception as e:
        error_msg = str(e)
        if "RESOURCE_EXHAUSTED" in error_msg or "quota" in error_msg.lower():
            print(f"      ⚠️ API quota exceeded")
        else:
            print(f"      ⚠️ Error: {error_msg[:100]}")
        return False

def generate_images_for_type(client, items: list, output_dir: Path, manifest_file: Path, 
                              prompt_func, item_key: str, type_name: str):
    """Generic function to generate images for any content type."""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load or clear manifest based on force flag
    if FORCE_REGENERATE:
        manifest = {}
        print(f"   🔄 Force regenerate enabled - clearing existing {type_name}")
    elif manifest_file.exists():
        with open(manifest_file, 'r', encoding='utf-8') as f:
            manifest = json.load(f)
    else:
        manifest = {}
    
    use_ai = client is not None
    generated = 0
    ai_generated = 0
    skipped = 0
    errors = 0
    
    for i, item in enumerate(items):
        key = item.get(item_key, f"item_{i}")
        
        # Check if already generated (unless forcing or regenerating placeholders)
        if key in manifest and not FORCE_REGENERATE:
            existing = manifest[key]
            # Skip if AI generated, regenerate if placeholder and flag is set
            if existing.get('type') == 'ai_generated':
                skipped += 1
                continue
            elif existing.get('type') == 'placeholder' and not REGENERATE_PLACEHOLDERS:
                skipped += 1
                continue
            # If placeholder and REGENERATE_PLACEHOLDERS, continue to regenerate
        
        filename = generate_filename(key)
        filepath = output_dir / filename
        
        print(f"\n   [{i+1}/{len(items)}] {key}")
        
        if use_ai:
            prompt = prompt_func(item)
            print(f"      🎨 Generating with Gemini...")
            
            success = generate_image_with_gemini(client, prompt, filepath)
            
            if success:
                print(f"      ✅ Saved: {filename}")
                manifest[key] = {
                    'filename': filename,
                    'lesson_id': item.get('lesson_id', 0),
                    'type': 'ai_generated'
                }
                ai_generated += 1
                time.sleep(2)  # Rate limiting
            else:
                print(f"      → Using placeholder")
                svg_content = generate_placeholder_svg(key, "🖼️")
                svg_path = output_dir / f"{filename.replace('.png', '.svg')}"
                with open(svg_path, 'w', encoding='utf-8') as f:
                    f.write(svg_content)
                manifest[key] = {
                    'filename': f"{filename.replace('.png', '.svg')}",
                    'lesson_id': item.get('lesson_id', 0),
                    'type': 'placeholder'
                }
                errors += 1
        else:
            svg_content = generate_placeholder_svg(key, "🖼️")
            svg_path = output_dir / f"{filename.replace('.png', '.svg')}"
            with open(svg_path, 'w', encoding='utf-8') as f:
                f.write(svg_content)
            manifest[key] = {
                'filename': f"{filename.replace('.png', '.svg')}",
                'lesson_id': item.get('lesson_id', 0),
                'type': 'placeholder'
            }
        
        generated += 1
        
        # Save periodically
        if generated % 5 == 0:
            with open(manifest_file, 'w', encoding='utf-8') as f:
                json.dump(manifest, f, ensure_ascii=False, indent=2)
    
    # Final save
    with open(manifest_file, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    
    return generated, ai_generated, skipped, errors

def main():
    """Main function to generate all images."""
    print("=" * 60)
    print("🇧🇦 Gemini AI Image Generator for Bosanski Jezik")
    print("=" * 60)
    
    if FORCE_REGENERATE:
        print("\n⚠️  FORCE REGENERATE MODE - All images will be regenerated!")
    elif REGENERATE_PLACEHOLDERS:
        print("\n🔄 REGENERATE PLACEHOLDERS MODE - Replacing placeholder images with AI")
    
    # Setup directories
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    CULTURE_DIR.mkdir(parents=True, exist_ok=True)
    DIALOGUE_DIR.mkdir(parents=True, exist_ok=True)
    COMIC_BG_DIR.mkdir(parents=True, exist_ok=True)
    AVATAR_DIR.mkdir(parents=True, exist_ok=True)
    
    # Check for GenAI client
    client = setup_genai_client()
    
    if client is None:
        print("\n⚠️  Running in placeholder mode (no AI generation)")
        print("   Install: pip install google-genai")
        print("   Set GOOGLE_API_KEY to enable AI image generation")
    else:
        print("\n✅ Gemini AI ready for image generation")
    
    total_stats = {'generated': 0, 'ai': 0, 'skipped': 0, 'errors': 0}
    
    # 1. Generate vocabulary images
    print("\n" + "=" * 50)
    print("📚 VOCABULARY IMAGES")
    print("=" * 50)
    words = collect_vocabulary_words()
    print(f"Found {len(words)} vocabulary words")
    
    def vocab_prompt(item):
        return create_image_prompt(item['bosnian'], item['english'], item.get('example'))
    
    g, ai, s, e = generate_images_for_type(
        client, words, OUTPUT_DIR, MANIFEST_FILE,
        vocab_prompt, 'bosnian', 'vocabulary'
    )
    total_stats['generated'] += g
    total_stats['ai'] += ai
    total_stats['skipped'] += s
    total_stats['errors'] += e
    
    # 2. Generate culture images
    print("\n" + "=" * 50)
    print("🏛️ CULTURE IMAGES")
    print("=" * 50)
    culture_items = collect_culture_items()
    print(f"Found {len(culture_items)} culture topics")
    
    def culture_prompt(item):
        return create_culture_prompt(item['title'], item['content'], item.get('facts', []))
    
    g, ai, s, e = generate_images_for_type(
        client, culture_items, CULTURE_DIR, CULTURE_MANIFEST,
        culture_prompt, 'title', 'culture'
    )
    total_stats['generated'] += g
    total_stats['ai'] += ai
    total_stats['skipped'] += s
    total_stats['errors'] += e
    
    # 3. Generate dialogue images
    print("\n" + "=" * 50)
    print("💬 DIALOGUE IMAGES")
    print("=" * 50)
    dialogue_items = collect_dialogue_items()
    print(f"Found {len(dialogue_items)} dialogue scenes")
    
    def dialogue_prompt(item):
        return create_dialogue_prompt(item['title'], item.get('setting', ''))
    
    g, ai, s, e = generate_images_for_type(
        client, dialogue_items, DIALOGUE_DIR, DIALOGUE_MANIFEST,
        dialogue_prompt, 'title', 'dialogue'
    )
    total_stats['generated'] += g
    total_stats['ai'] += ai
    total_stats['skipped'] += s
    total_stats['errors'] += e
    
    # 4. Generate comic background images
    print("\n" + "=" * 50)
    print("🎭 COMIC BACKGROUND IMAGES")
    print("=" * 50)
    comic_items = collect_comic_backgrounds()
    print(f"Found {len(comic_items)} comic scenes")
    
    def comic_bg_prompt(item):
        return create_comic_background_prompt(item['comic_title'], item.get('characters', []))
    
    g, ai, s, e = generate_images_for_type(
        client, comic_items, COMIC_BG_DIR, COMIC_BG_MANIFEST,
        comic_bg_prompt, 'title', 'comic_background'
    )
    total_stats['generated'] += g
    total_stats['ai'] += ai
    total_stats['skipped'] += s
    total_stats['errors'] += e
    
    # 5. Generate character avatar images
    print("\n" + "=" * 50)
    print("👤 CHARACTER AVATAR IMAGES")
    print("=" * 50)
    avatar_items = collect_character_avatars()
    print(f"Found {len(avatar_items)} unique characters")
    
    def avatar_prompt(item):
        return create_avatar_prompt(item['name'], item.get('is_female', False), item.get('is_shopkeeper', False))
    
    g, ai, s, e = generate_images_for_type(
        client, avatar_items, AVATAR_DIR, AVATAR_MANIFEST,
        avatar_prompt, 'title', 'avatar'
    )
    total_stats['generated'] += g
    total_stats['ai'] += ai
    total_stats['skipped'] += s
    total_stats['errors'] += e
    
    # Summary
    print("\n" + "=" * 60)
    print("🎉 ALL GENERATION COMPLETE!")
    print("=" * 60)
    print(f"  📊 Total processed: {total_stats['generated']}")
    print(f"  🎨 AI generated: {total_stats['ai']}")
    print(f"  ⏭️  Skipped (exists): {total_stats['skipped']}")
    print(f"  ⚠️  Errors/fallback: {total_stats['errors']}")
    print(f"\n  📁 Vocabulary: {OUTPUT_DIR}")
    print(f"  📁 Culture: {CULTURE_DIR}")
    print(f"  📁 Dialogue: {DIALOGUE_DIR}")
    print(f"  📁 Comic BG: {COMIC_BG_DIR}")
    print(f"  📁 Avatars: {AVATAR_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
