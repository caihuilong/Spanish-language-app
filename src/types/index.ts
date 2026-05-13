export interface Keyword {
  id: number;
  word: string;
  translation: string;
  phonetic: string;
  examples: string[];
  memoryTip?: string;
}

export interface Phrase {
  phrase: string;
  translation: string;
  usage: string;
}

export interface Article {
  id: number;
  title: string;
  titleCN: string;
  level: 'A1' | 'A2';
  content: string;
  illustration: string;
  keywords: Keyword[];
  phrases: Phrase[];
  audioUrl?: string;
  order: number;
}

export interface LearningRecord {
  articleId: number;
  keywordId: number;
  learnedAt: number;
  nextReview: number;
  reviewCount: number;
  masteryLevel: number;
}

export interface UserProgress {
  currentArticleId: number;
  currentLevel: 'A1' | 'A2';
  completedArticles: number[];
  learnedKeywords: number[];
  totalStudyTime: number;
  streakDays: number;
  lastStudyDate: string;
  totalWordsLearned: number;
}

export interface ReviewItem {
  keywordId: number;
  articleId: number;
  word: string;
  translation: string;
  nextReview: number;
  masteryLevel: number;
}

export interface TestQuestion {
  id: number;
  type: 'vocabulary' | 'listening' | 'reading';
  question: string;
  options: string[];
  correctAnswer: number;
  relatedKeywordId?: number;
  relatedArticleId?: number;
}

export interface DailyStats {
  date: string;
  articlesLearned: number;
  wordsReviewed: number;
  testScore: number;
  studyTime: number;
}
