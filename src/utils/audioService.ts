const EDGE_TTS_URL = 'http://localhost:3003'
const USE_EDGE_TTS = true

let currentAudio: HTMLAudioElement | null = null
let isEdgeTTSAvailable = false

export const AudioService = {
  async checkEdgeTTS(): Promise<boolean> {
    if (!USE_EDGE_TTS) return false
    
    try {
      const response = await fetch(`${EDGE_TTS_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(1000)
      })
      isEdgeTTSAvailable = response.ok
      if (isEdgeTTSAvailable) {
        console.log('✅ Edge TTS 服务已连接')
      }
      return isEdgeTTSAvailable
    } catch (error) {
      console.warn('⚠️ Edge TTS 服务未运行')
      console.warn('💡 运行以下命令启动:')
      console.warn('   cd spanish-learning-app/server')
      console.warn('   node simple-tts-server.js')
      isEdgeTTSAvailable = false
      return false
    }
  },

  async speakSpanish(text: string, rate: string = '-20%'): Promise<void> {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }

    if (isEdgeTTSAvailable) {
      try {
        const response = await fetch(`${EDGE_TTS_URL}/synthesize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: text,
            voice: 'es-ES-AlvaroNeural',
            rate: rate
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.path) {
            const audio = new Audio(`${EDGE_TTS_URL}${data.path}`)
            currentAudio = audio
            await audio.play()
            return
          }
        }
      } catch (error) {
        console.error('Edge TTS failed, falling back to Web Speech')
      }
    }

    this.speakWithWebSpeech(text)
  },

  speakWithWebSpeech(text: string): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 0.35
      utterance.pitch = 1.1
      utterance.volume = 1.0
      speechSynthesis.speak(utterance)
    }
  },

  async speakWord(word: string): Promise<void> {
    await this.speakSpanish(word, '-30%')
  },

  async speakSentence(sentence: string): Promise<void> {
    await this.speakSpanish(sentence, '-20%')
  },

  stop(): void {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
  },

  isEdgeTTSEnabled(): boolean {
    return isEdgeTTSAvailable
  }
}

export default AudioService
