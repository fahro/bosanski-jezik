#!/usr/bin/env python3
"""
Script to generate audio files for all vocabulary words and examples.
Uses Azure Cognitive Services TTS with native Bosnian voices for authentic pronunciation.
Requires AZURE_SPEECH_KEY and AZURE_SPEECH_REGION environment variables.
"""

import os
import re
import hashlib
import json
import unicodedata
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Import lesson data
from app.data.a1_lessons import A1_LESSONS
from app.data.a1_lessons_2 import A1_LESSONS_PART2
from app.data.a1_lessons_3 import A1_LESSONS_PART3
from app.data.a1_lessons_4 import A1_LESSONS_PART4
from app.data.a2_lessons import A2_LESSONS
from app.data.a2_lessons_2 import A2_LESSONS_PART2
from app.data.a2_lessons_3 import A2_LESSONS_PART3
from app.data.a2_lessons_4 import A2_LESSONS_PART4
from app.data.b1_lessons import B1_LESSONS
from app.data.b1_lessons_2 import B1_LESSONS_PART2
from app.data.b1_lessons_3 import B1_LESSONS_PART3
from app.data.b2_lessons import B2_LESSONS
from app.data.writing_exercises import WRITING_EXERCISES

# Combine all lessons (A1 + A2 + B1 + B2)
ALL_LESSONS = A1_LESSONS + A1_LESSONS_PART2 + A1_LESSONS_PART3 + A1_LESSONS_PART4 + A2_LESSONS + A2_LESSONS_PART2 + A2_LESSONS_PART3 + A2_LESSONS_PART4 + B1_LESSONS + B1_LESSONS_PART2 + B1_LESSONS_PART3 + B2_LESSONS

AUDIO_DIR = Path(__file__).parent / "static" / "audio"
MANIFEST_FILE = AUDIO_DIR / "manifest.json"

# Gender mapping for speakers/characters
FEMALE_NAMES = {'Amina', 'Ana', 'Maja', 'Amra', 'Sara', 'Sabina', 'Lejla', 'Naida', 'Nana', 'Majka', 'Sestra', 'Kći', 'Žena', 'Snaha', 'Hana', 'Selma', 'Amela', 'Lamija', 'Samra', 'Alma', 'Amira', 'Gošća', 'Turistkinja', 'Studentica', 'Profesorica', 'Konobarica'}
MALE_NAMES = {'Emir', 'Ahmed', 'Kenan', 'Prodavač', 'Kupac', 'Dućandžija', 'Tarik', 'Haris', 'Djed', 'Otac', 'Brat', 'Sin', 'Muž', 'Doktor', 'Mirza', 'Damir', 'Amir', 'Bankar', 'Šef', 'Recepcioner', 'Vodič', 'Domaćin', 'Turista', 'Student', 'Profesor', 'Konobar', 'Aktivista', 'Građanin', 'Klijent', 'Adnan', 'Edin'}

# Azure TTS Bosnian voices - Native speakers!
FEMALE_VOICE = "bs-BA-VesnaNeural"   # Bosnian female voice
MALE_VOICE = "bs-BA-GoranNeural"     # Bosnian male voice
DEFAULT_VOICE = "bs-BA-VesnaNeural"  # Default for vocabulary etc.

# Bosnian number words for TTS
BOSNIAN_ONES = {
    0: 'nula', 1: 'jedan', 2: 'dva', 3: 'tri', 4: 'četiri',
    5: 'pet', 6: 'šest', 7: 'sedam', 8: 'osam', 9: 'devet'
}

BOSNIAN_TEENS = {
    10: 'deset', 11: 'jedanaest', 12: 'dvanaest', 13: 'trinaest',
    14: 'četrnaest', 15: 'petnaest', 16: 'šesnaest', 17: 'sedamnaest',
    18: 'osamnaest', 19: 'devetnaest'
}

BOSNIAN_TENS = {
    2: 'dvadeset', 3: 'trideset', 4: 'četrdeset', 5: 'pedeset',
    6: 'šezdeset', 7: 'sedamdeset', 8: 'osamdeset', 9: 'devedeset'
}

BOSNIAN_HUNDREDS = {
    1: 'sto', 2: 'dvjesto', 3: 'tristo', 4: 'četiristo',
    5: 'petsto', 6: 'šesto', 7: 'sedamsto', 8: 'osamsto', 9: 'devetsto'
}

def number_to_bosnian(n: int) -> str:
    """Convert a number (0-9999) to Bosnian words."""
    if n < 0:
        return 'minus ' + number_to_bosnian(-n)
    
    if n < 10:
        return BOSNIAN_ONES[n]
    
    if n < 20:
        return BOSNIAN_TEENS[n]
    
    if n < 100:
        tens, ones = divmod(n, 10)
        if ones == 0:
            return BOSNIAN_TENS[tens]
        return f"{BOSNIAN_TENS[tens]} {BOSNIAN_ONES[ones]}"
    
    if n < 1000:
        hundreds, remainder = divmod(n, 100)
        if remainder == 0:
            return BOSNIAN_HUNDREDS[hundreds]
        return f"{BOSNIAN_HUNDREDS[hundreds]} {number_to_bosnian(remainder)}"
    
    if n < 10000:
        thousands, remainder = divmod(n, 1000)
        if thousands == 1:
            thousand_word = 'hiljadu'
        elif thousands in (2, 3, 4):
            thousand_word = f"{BOSNIAN_ONES[thousands]} hiljade"
        else:
            thousand_word = f"{BOSNIAN_ONES[thousands]} hiljada"
        
        if remainder == 0:
            return thousand_word
        return f"{thousand_word} {number_to_bosnian(remainder)}"
    
    # For larger numbers, just return digits
    return str(n)

def convert_numbers_to_words(text: str) -> str:
    """Convert all numeric values in text to Bosnian words for proper TTS pronunciation."""
    def replace_number(match):
        num_str = match.group(0)
        try:
            num = int(num_str)
            if 0 <= num <= 9999:
                return number_to_bosnian(num)
        except ValueError:
            pass
        return num_str
    
    # Replace numbers (1-4 digits) with Bosnian words
    # Use word boundaries to avoid partial replacements
    result = re.sub(r'\b\d{1,4}\b', replace_number, text)
    return result

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

def normalize_text_for_audio(text: str) -> str:
    """Normalize text before generating audio filename - strip trailing punctuation."""
    # Strip trailing punctuation like ... ! ? .
    text = text.strip()
    while text and text[-1] in '.!?…':
        text = text[:-1]
    return text.strip()

def get_audio_filename(text: str) -> str:
    """Generate a readable filename based on text content."""
    # Normalize text first to ensure consistent filenames
    normalized_text = normalize_text_for_audio(text)
    safe_name = sanitize_filename(normalized_text)
    # Add short hash suffix to ensure uniqueness
    text_hash = hashlib.md5(normalized_text.encode('utf-8')).hexdigest()[:6]
    return f"{safe_name}_{text_hash}.mp3"

def get_voice_for_speaker(speaker: str) -> str:
    """Determine voice based on speaker name."""
    if not speaker:
        return DEFAULT_VOICE
    
    # Check exact match first
    if speaker in FEMALE_NAMES:
        return FEMALE_VOICE
    if speaker in MALE_NAMES:
        return MALE_VOICE
    
    # Check if name contains female/male indicators
    speaker_lower = speaker.lower()
    if any(name.lower() in speaker_lower for name in FEMALE_NAMES):
        return FEMALE_VOICE
    if any(name.lower() in speaker_lower for name in MALE_NAMES):
        return MALE_VOICE
    
    return DEFAULT_VOICE

def generate_audio_azure(speech_config, text: str, output_path: Path, voice: str = DEFAULT_VOICE, force: bool = False) -> bool:
    """Generate audio file using Azure TTS with native Bosnian voices."""
    import azure.cognitiveservices.speech as speechsdk
    
    if output_path.exists() and not force:
        print(f"  ✓ Already exists: {output_path.name}")
        return True
    
    try:
        # Set the voice
        speech_config.speech_synthesis_voice_name = voice
        
        # Create audio config to save to file
        audio_config = speechsdk.audio.AudioOutputConfig(filename=str(output_path))
        
        # Create synthesizer
        synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
        
        # Convert numbers to words for proper pronunciation
        text_for_speech = convert_numbers_to_words(text)
        
        # Generate speech
        result = synthesizer.speak_text_async(text_for_speech).get()
        
        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            voice_icon = "♀" if "Vesna" in voice else "♂" if "Goran" in voice else "○"
            print(f"  ✓ Generated [{voice_icon}]: {output_path.name} - '{text[:40]}...'")
            return True
        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation = result.cancellation_details
            print(f"  ✗ Canceled: {cancellation.reason}")
            if cancellation.reason == speechsdk.CancellationReason.Error:
                print(f"     Error details: {cancellation.error_details}")
            return False
    except Exception as e:
        print(f"  ✗ Error for '{text[:30]}...': {e}")
        return False
    
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
    import argparse
    import azure.cognitiveservices.speech as speechsdk
    
    parser = argparse.ArgumentParser(description='Generate audio files for lessons')
    parser.add_argument('--force', action='store_true', help='Regenerate all audio files')
    parser.add_argument('--force-voiced', action='store_true', help='Regenerate only dialogue/culture audio with correct voices')
    args = parser.parse_args()
    
    # Azure Speech credentials
    speech_key = os.getenv("AZURE_SPEECH_KEY")
    speech_region = os.getenv("AZURE_SPEECH_REGION")
    
    if not speech_key or not speech_region:
        print("ERROR: Azure Speech credentials not set!")
        print("Create a .env file with:")
        print("  AZURE_SPEECH_KEY=your-key-here")
        print("  AZURE_SPEECH_REGION=westeurope")
        return
    
    # Configure Azure Speech
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
    speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3)
    
    print(f"Using Azure TTS with native Bosnian voices:")
    print(f"  Female: {FEMALE_VOICE}")
    print(f"  Male: {MALE_VOICE}")
    
    # Create audio directory
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    
    # Collect all texts to generate with speaker info: (text, speaker, is_voiced)
    texts_to_generate = []
    manifest = {}
    
    print("Collecting all Bosnian text from lessons...")
    
    for lesson in ALL_LESSONS:
        lesson_id = lesson["id"]
        print(f"\nLesson {lesson_id}: {lesson['title']}")
        
        # 1. Vocabulary words and examples (no specific speaker)
        for word in lesson.get("vocabulary", []):
            bosnian = word.get("bosnian", "")
            example = word.get("example", "")
            
            if bosnian:
                texts_to_generate.append((bosnian, None, False))
            if example:
                texts_to_generate.append((example, None, False))
        
        # 2. Dialogue lines - WITH SPEAKER INFO
        for line in lesson.get("dialogue", []):
            text = line.get("text", "")
            speaker = line.get("speaker", "")
            if text:
                texts_to_generate.append((text, speaker, True))
        
        # 3. Quiz questions and options (Bosnian parts only)
        for quiz in lesson.get("quiz", []):
            question = quiz.get("question", "")
            # Only add if question is in Bosnian (contains Bosnian characters or patterns)
            if question and ("Kako" in question or "Koja" in question or "Šta" in question or "Koji" in question):
                texts_to_generate.append((question, None, False))
            # Add Bosnian options
            for option in quiz.get("options", []):
                # Skip English-only options
                if option and not option[0].isupper() or any(c in option for c in "čćšžđČĆŠŽĐ"):
                    texts_to_generate.append((option, None, False))
        
        # 4. Exercises - fill in blank sentences, matching pairs, etc.
        for exercise in lesson.get("exercises", []):
            content = exercise.get("content", {})
            
            # Fill blank sentences
            sentence = content.get("sentence", "")
            if sentence:
                # Replace blank with the answer for full sentence
                answer = exercise.get("answer", "")
                full_sentence = sentence.replace("_____", answer).replace("___", answer)
                texts_to_generate.append((full_sentence, None, False))
            
            # Matching pairs - Bosnian words
            pairs = content.get("pairs", [])
            for pair in pairs:
                if isinstance(pair, list) and len(pair) > 0:
                    texts_to_generate.append((pair[0], None, False))  # First item is usually Bosnian
            
            # Translation text
            trans_text = content.get("text", "")
            if trans_text:
                texts_to_generate.append((trans_text, None, False))
        
        # 5. Cultural notes (no specific speaker)
        cultural_note = lesson.get("cultural_note", "")
        if cultural_note:
            # Split into sentences for better audio
            sentences = re.split(r'[.!?]+', cultural_note)
            for sentence in sentences:
                sentence = sentence.strip()
                if sentence and len(sentence) > 10:
                    texts_to_generate.append((sentence, None, False))
        
        # 6. Cultural comic panels - WITH SPEAKER INFO
        cultural_comic = lesson.get("cultural_comic", {})
        for panel in cultural_comic.get("panels", []):
            panel_text = panel.get("text", "")
            panel_name = panel.get("name", "")
            if panel_text:
                texts_to_generate.append((panel_text, panel_name, True))
    
    # 7. Writing exercises - sentences from all lessons
    print("\nCollecting writing exercise sentences...")
    for lesson_id, sentences in WRITING_EXERCISES.items():
        print(f"  Lesson {lesson_id}: {len(sentences)} writing sentences")
        for sentence in sentences:
            texts_to_generate.append((sentence, None, False))
    
    # Remove duplicates while preserving order and keeping speaker info
    seen = {}
    unique_texts = []
    for text, speaker, is_voiced in texts_to_generate:
        text = extract_bosnian_text(text)
        if text and len(text) > 1:
            if text not in seen:
                seen[text] = (speaker, is_voiced)
                unique_texts.append((text, speaker, is_voiced))
            elif is_voiced and not seen[text][1]:
                # Update if this version has speaker info
                seen[text] = (speaker, is_voiced)
                # Update in unique_texts
                for i, (t, s, v) in enumerate(unique_texts):
                    if t == text:
                        unique_texts[i] = (text, speaker, is_voiced)
                        break
    
    print(f"\nTotal unique texts to generate: {len(unique_texts)}")
    voiced_count = sum(1 for _, _, is_voiced in unique_texts if is_voiced)
    print(f"Texts with speaker-specific voice: {voiced_count}")
    print("=" * 50)
    
    # Generate audio files
    success_count = 0
    for i, (text, speaker, is_voiced) in enumerate(unique_texts, 1):
        filename = get_audio_filename(text)
        output_path = AUDIO_DIR / filename
        voice = get_voice_for_speaker(speaker) if speaker else DEFAULT_VOICE
        
        # Determine if we should force regenerate this file
        force_this = args.force or (args.force_voiced and is_voiced)
        
        print(f"[{i}/{len(unique_texts)}]", end="")
        if generate_audio_azure(speech_config, text, output_path, voice=voice, force=force_this):
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
