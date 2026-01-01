import { useState, useCallback, useRef } from 'react'
import { getApiUrl } from '../api'
import SparkMD5 from 'spark-md5'

// Transliterate Bosnian characters to ASCII
function sanitizeFilename(text, maxLength = 50) {
  const replacements = {
    'č': 'c', 'ć': 'c', 'š': 's', 'ž': 'z', 'đ': 'dj',
    'Č': 'C', 'Ć': 'C', 'Š': 'S', 'Ž': 'Z', 'Đ': 'Dj'
  }
  
  let result = text
  for (const [bos, lat] of Object.entries(replacements)) {
    result = result.split(bos).join(lat)
  }
  
  // Remove accents and non-ASCII
  result = result.normalize('NFKD').replace(/[^\w\s-]/g, '')
  result = result.replace(/[\s]+/g, '_')
  result = result.toLowerCase().replace(/^_+|_+$/g, '')
  
  if (result.length > maxLength) {
    result = result.substring(0, maxLength).replace(/_+$/, '')
  }
  
  return result
}

// Normalize text - strip trailing punctuation for consistent filenames
function normalizeTextForAudio(text) {
  text = text.trim()
  while (text && '.!?…'.includes(text[text.length - 1])) {
    text = text.slice(0, -1)
  }
  return text.trim()
}

// Generate filename matching the Python script
function getAudioFilename(text) {
  const normalizedText = normalizeTextForAudio(text)
  const safeName = sanitizeFilename(normalizedText)
  const hash = SparkMD5.hash(normalizedText).substring(0, 6)
  return `${safeName}_${hash}.mp3`
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef(null)

  const speak = useCallback(async (text) => {
    if (!text) return

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setIsSpeaking(true)
    const baseUrl = getApiUrl()

    try {
      // Generate filename directly (matching Python script logic)
      const filename = getAudioFilename(text)
      const audioUrl = `${baseUrl}/audio/${filename}`
      
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      
      audio.onended = () => setIsSpeaking(false)
      audio.onerror = () => {
        console.warn('Audio file not found, using fallback:', filename)
        setIsSpeaking(false)
        fallbackSpeak(text)
      }

      await audio.play()
    } catch (error) {
      console.error('Audio Error:', error)
      setIsSpeaking(false)
      fallbackSpeak(text)
    }
  }, [])

  const fallbackSpeak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'sr-RS'
    utterance.rate = 0.9
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking }
}
