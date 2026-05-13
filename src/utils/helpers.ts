export const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`
  }
  if (minutes > 0) {
    return `${minutes}分钟`
  }
  return `${seconds}秒`
}

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0]
}

export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export const getLevelLabel = (level: 'A1' | 'A2'): string => {
  return level === 'A1' ? '初级' : '中级'
}

export const getNextArticleId = (currentId: number, completedIds: number[]): number => {
  const allIds = Array.from({ length: 150 }, (_, i) => i + 1)
  for (const id of allIds) {
    if (!completedIds.includes(id)) {
      return id
    }
  }
  return currentId
}

export const playPronunciation = (text: string): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }
}

export const playWordPronunciation = (word: string): void => {
  playPronunciation(word)
}

export const getDifficultyStars = (level: 'A1' | 'A2'): string => {
  return level === 'A1' ? '⭐' : '⭐⭐'
}
