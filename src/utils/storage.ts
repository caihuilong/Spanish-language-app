import { UserProgress, LearningRecord, ReviewItem, DailyStats } from '../types'

const STORAGE_KEYS = {
  USER_PROGRESS: 'spanish_user_progress',
  LEARNING_RECORDS: 'spanish_learning_records',
  DAILY_STATS: 'spanish_daily_stats'
}

const defaultProgress: UserProgress = {
  currentArticleId: 1,
  currentLevel: 'A1',
  completedArticles: [],
  learnedKeywords: [],
  totalStudyTime: 0,
  streakDays: 0,
  lastStudyDate: new Date().toISOString().split('T')[0],
  totalWordsLearned: 0
}

export const StorageService = {
  getUserProgress: (): UserProgress => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)
      if (stored) {
        return JSON.parse(stored)
      }
      return defaultProgress
    } catch (error) {
      console.error('Error loading user progress:', error)
      return defaultProgress
    }
  },

  saveUserProgress: (progress: UserProgress): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress))
    } catch (error) {
      console.error('Error saving user progress:', error)
    }
  },

  updateProgress: (updates: Partial<UserProgress>): UserProgress => {
    const current = StorageService.getUserProgress()
    const updated = { ...current, ...updates }
    StorageService.saveUserProgress(updated)
    return updated
  },

  markArticleCompleted: (articleId: number): void => {
    const progress = StorageService.getUserProgress()
    if (!progress.completedArticles.includes(articleId)) {
      progress.completedArticles.push(articleId)
      progress.completedArticles.sort((a, b) => a - b)
      StorageService.saveUserProgress(progress)
    }
  },

  markKeywordLearned: (keywordId: number): void => {
    const progress = StorageService.getUserProgress()
    if (!progress.learnedKeywords.includes(keywordId)) {
      progress.learnedKeywords.push(keywordId)
      progress.totalWordsLearned = progress.learnedKeywords.length
      StorageService.saveUserProgress(progress)
    }
  },

  getLearningRecords: (): LearningRecord[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEARNING_RECORDS)
      if (stored) {
        return JSON.parse(stored)
      }
      return []
    } catch (error) {
      console.error('Error loading learning records:', error)
      return []
    }
  },

  saveLearningRecord: (record: LearningRecord): void => {
    try {
      const records = StorageService.getLearningRecords()
      const existingIndex = records.findIndex(r => r.keywordId === record.keywordId)
      
      if (existingIndex >= 0) {
        records[existingIndex] = record
      } else {
        records.push(record)
      }
      
      localStorage.setItem(STORAGE_KEYS.LEARNING_RECORDS, JSON.stringify(records))
    } catch (error) {
      console.error('Error saving learning record:', error)
    }
  },

  getReviewItems: (): ReviewItem[] => {
    const records = StorageService.getLearningRecords()
    const now = Date.now()
    
    return records
      .filter(record => record.nextReview <= now)
      .map(record => ({
        keywordId: record.keywordId,
        articleId: record.articleId,
        word: '',
        translation: '',
        nextReview: record.nextReview,
        masteryLevel: record.masteryLevel
      }))
      .sort((a, b) => a.nextReview - b.nextReview)
  },

  updateReview: (keywordId: number, correct: boolean): void => {
    const records = StorageService.getLearningRecords()
    const record = records.find(r => r.keywordId === keywordId)
    
    if (record) {
      record.reviewCount += 1
      
      if (correct) {
        record.masteryLevel = Math.min(5, record.masteryLevel + 1)
      } else {
        record.masteryLevel = Math.max(0, record.masteryLevel - 1)
      }
      
      const intervals = [20 * 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000, 3 * 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000, 14 * 24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000]
      const interval = intervals[Math.min(record.masteryLevel, intervals.length - 1)]
      
      record.nextReview = Date.now() + interval
      StorageService.saveLearningRecord(record)
    }
  },

  createLearningRecord: (articleId: number, keywordId: number): void => {
    const record: LearningRecord = {
      articleId,
      keywordId,
      learnedAt: Date.now(),
      nextReview: Date.now() + 20 * 60 * 1000,
      reviewCount: 0,
      masteryLevel: 0
    }
    StorageService.saveLearningRecord(record)
  },

  getDailyStats: (): DailyStats[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DAILY_STATS)
      if (stored) {
        return JSON.parse(stored)
      }
      return []
    } catch (error) {
      console.error('Error loading daily stats:', error)
      return []
    }
  },

  saveDailyStat: (stat: DailyStats): void => {
    try {
      const stats = StorageService.getDailyStats()
      const todayIndex = stats.findIndex(s => s.date === stat.date)
      
      if (todayIndex >= 0) {
        stats[todayIndex] = {
          ...stats[todayIndex],
          articlesLearned: stats[todayIndex].articlesLearned + stat.articlesLearned,
          wordsReviewed: stats[todayIndex].wordsReviewed + stat.wordsReviewed,
          studyTime: stats[todayIndex].studyTime + stat.studyTime
        }
      } else {
        stats.push(stat)
      }
      
      localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats))
    } catch (error) {
      console.error('Error saving daily stats:', error)
    }
  },

  updateStreak: (): void => {
    const progress = StorageService.getUserProgress()
    const today = new Date().toISOString().split('T')[0]
    const lastStudy = progress.lastStudyDate
    
    if (lastStudy === today) {
      return
    }
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    if (lastStudy === yesterdayStr) {
      progress.streakDays += 1
    } else {
      progress.streakDays = 1
    }
    
    progress.lastStudyDate = today
    StorageService.saveUserProgress(progress)
  },

  clearAllData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS)
    localStorage.removeItem(STORAGE_KEYS.LEARNING_RECORDS)
    localStorage.removeItem(STORAGE_KEYS.DAILY_STATS)
  }
}
