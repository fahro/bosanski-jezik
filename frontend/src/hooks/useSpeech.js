import { useState, useCallback, useRef } from 'react'
import { api, getApiUrl } from '../api'

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef(null)

  const playAudio = async (audioUrl, shouldRevokeUrl = false) => {
    const audio = new Audio(audioUrl)
    audioRef.current = audio
    
    audio.onended = () => {
      setIsSpeaking(false)
      if (shouldRevokeUrl) URL.revokeObjectURL(audioUrl)
    }
    
    audio.onerror = () => {
      setIsSpeaking(false)
      if (shouldRevokeUrl) URL.revokeObjectURL(audioUrl)
    }

    await audio.play()
  }

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
      // First, check if pre-generated audio exists
      const checkResponse = await fetch(`${baseUrl}/api/audio/${encodeURIComponent(text)}`)
      const checkData = await checkResponse.json()
      
      if (checkData.exists && checkData.url) {
        // Use pre-generated audio
        await playAudio(baseUrl + checkData.url)
        return
      }

      // Fallback: generate on-the-fly
      const response = await fetch(baseUrl + '/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'alloy' })
      })

      if (!response.ok) {
        throw new Error('TTS request failed')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      await playAudio(audioUrl, true)
    } catch (error) {
      console.error('TTS Error:', error)
      setIsSpeaking(false)
      // Fallback to Web Speech API if OpenAI fails
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
