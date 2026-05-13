const TTS_SERVER_URL = 'http://localhost:3003'

interface Voice {
  id: string
  name: string
  region: string
  recommended?: boolean
}

interface TTSResponse {
  success: boolean
  filename?: string
  path?: string
  error?: string
  hint?: string
}

let currentAudio: HTMLAudioElement | null = null

export const EdgeTTSService = {
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${TTS_SERVER_URL}/health`)
      return response.ok
    } catch {
      console.warn('Edge TTS server not available')
      return false
    }
  },

  async getVoices(): Promise<Voice[]> {
    try {
      const response = await fetch(`${TTS_SERVER_URL}/voices`)
      const data = await response.json()
      return data.voices || []
    } catch (error) {
      console.error('Failed to get voices:', error)
      return []
    }
  },

  async speak(
    text: string, 
    voice: string = 'es-ES-AlvaroNeural', 
    rate: string = '-20%'
  ): Promise<HTMLAudioElement | null> {
    try {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio = null
      }

      console.log('🎤 Edge TTS synthesizing:', text.substring(0, 30) + '...')

      const response = await fetch(`${TTS_SERVER_URL}/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          text: text,
          voice: voice,
          rate: rate
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('TTS Error:', error)
        throw new Error(error.error || 'TTS failed')
      }

      const data: TTSResponse = await response.json()

      if (data.success && data.path) {
        const audioUrl = `${TTS_SERVER_URL}${data.path}`
        console.log('✅ TTS ready:', audioUrl)

        return new Promise((resolve, reject) => {
          const audio = new Audio(audioUrl)
          audio.crossOrigin = 'anonymous'
          
          audio.oncanplay = () => {
            console.log('🔊 Playing audio')
            resolve(audio)
          }
          
          audio.onerror = (e) => {
            console.error('❌ Audio error:', e)
            reject(new Error('Failed to load audio'))
          }

          audio.play().catch(reject)
        })
      }

      throw new Error('No audio path returned')
    } catch (error) {
      console.error('Edge TTS Error:', error)
      throw error
    }
  },

  async speakWord(
    word: string, 
    voice: string = 'es-ES-AlvaroNeural'
  ): Promise<void> {
    await this.speak(word, voice, '-30%')
  },

  async speakSentence(
    sentence: string, 
    voice: string = 'es-ES-AlvaroNeural'
  ): Promise<void> {
    await this.speak(sentence, voice, '-20%')
  },

  stop(): void {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      console.log('⏹️ Stopped')
    }
  }
}

export const createTTSManager = () => {
  let isAvailable = false
  let voices: Voice[] = []
  let selectedVoice = 'es-ES-AlvaroNeural'
  let speechRate = '-20%'

  const init = async () => {
    isAvailable = await EdgeTTSService.checkHealth()
    if (isAvailable) {
      voices = await EdgeTTSService.getVoices()
      console.log('✅ Edge TTS ready with', voices.length, 'voices')
    }
  }

  const speak = async (text: string) => {
    if (!isAvailable) {
      console.warn('Edge TTS not available')
      return
    }
    await EdgeTTSService.speak(text, selectedVoice, speechRate)
  }

  const setVoice = (voiceId: string) => {
    selectedVoice = voiceId
  }

  const setRate = (rate: string) => {
    speechRate = rate
  }

  return {
    init,
    speak,
    speakWord: (word: string) => speak(word),
    speakSentence: (sentence: string) => speak(sentence),
    setVoice,
    setRate,
    stop: () => EdgeTTSService.stop(),
    isAvailable: () => isAvailable,
    getVoices: () => voices
  }
}

export default EdgeTTSService
