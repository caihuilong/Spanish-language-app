import React, { createContext, useContext, useEffect, useState } from 'react'
import { startTTSService, stopTTSService } from '../utils/ttsService'

interface TTSContextType {
  isReady: boolean
  startTTS: () => Promise<boolean>
}

const TTSContext = createContext<TTSContextType>({
  isReady: false,
  startTTS: async () => false
})

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    startTTSService().then(success => {
      setIsReady(success)
    })

    return () => {
      stopTTSService()
    }
  }, [])

  return (
    <TTSContext.Provider value={{ isReady, startTTS: startTTSService }}>
      {children}
    </TTSContext.Provider>
  )
}

export const useTTS = () => useContext(TTSContext)
