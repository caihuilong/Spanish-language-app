import React, { useState, useEffect } from 'react'
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonProgressBar
} from '@ionic/react'
import { useHistory } from 'react-router-dom'
import { volumeHigh, checkmark, close, arrowForward, arrowBack } from 'ionicons/icons'
import { StorageService } from '../utils/storage'
import { articles } from '../data/articles'
import { ReviewItem } from '../types'

const SPEECH_RATES = {
  slow: 0.5,
  normal: 0.7,
  fast: 0.85
}

const ReviewPage: React.FC = () => {
  const history = useHistory()
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [speechRate, setSpeechRate] = useState<keyof typeof SPEECH_RATES>('slow')

  useEffect(() => {
    loadReviewItems()
  }, [])

  const loadReviewItems = () => {
    setIsLoading(true)
    const items = StorageService.getReviewItems()
    
    const enrichedItems = items.map(item => {
      const article = articles.find(a => a.id === item.articleId)
      const keyword = article?.keywords.find(k => k.id === item.keywordId)
      
      return {
        ...item,
        word: keyword?.word || '',
        translation: keyword?.translation || ''
      }
    })
    
    setReviewItems(enrichedItems)
    setIsLoading(false)
  }

  const currentItem = reviewItems[currentIndex]

  const playWordPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'es-ES'
      utterance.rate = SPEECH_RATES[speechRate]
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
    if (currentItem) {
      playWordPronunciation(currentItem.word)
    }
  }

  const handleAnswer = (correct: boolean) => {
    if (currentItem) {
      StorageService.updateReview(currentItem.keywordId, correct)
      setReviewedCount(prev => prev + 1)
      
      if (correct) {
        setCorrectCount(prev => prev + 1)
      }
      
      setShowAnswer(false)
      
      if (currentIndex < reviewItems.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        setIsFinished(true)
      }
    }
  }

  const handleNext = () => {
    if (currentIndex < reviewItems.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowAnswer(false)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setShowAnswer(false)
    }
  }

  const handleRestart = () => {
    loadReviewItems()
    setCurrentIndex(0)
    setShowAnswer(false)
    setReviewedCount(0)
    setCorrectCount(0)
    setIsFinished(false)
  }

  if (isLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>复习中心</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="empty-state" style={{ paddingTop: '100px' }}>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
              加载中...
            </p>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  if (reviewItems.length === 0 && !isFinished) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>复习中心</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="empty-state" style={{ paddingTop: '100px' }}>
            <div className="empty-state-icon">🎉</div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              太棒了！
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              目前没有需要复习的内容
            </p>
            <IonButton color="primary" onClick={() => history.push('/learn')}>
              去学习新内容
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  if (isFinished) {
    const accuracy = reviewedCount > 0 ? Math.round((correctCount / reviewedCount) * 100) : 0
    
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>复习完成</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="container" style={{ paddingTop: '60px' }}>
            <div className="card text-center animate-fade-in">
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>
                {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👍' : '💪'}
              </div>
              
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                复习完成！
              </h2>
              
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                {accuracy >= 80 ? '表现非常优秀！' : accuracy >= 60 ? '做得不错！' : '继续加油！'}
              </p>

              <div className="flex justify-center gap-xl" style={{ marginBottom: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)' }}>
                    {reviewedCount}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    复习数量
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--secondary)' }}>
                    {correctCount}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    正确数
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--warning)' }}>
                    {accuracy}%
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    正确率
                  </div>
                </div>
              </div>

              <IonButton 
                expand="block" 
                color="primary" 
                size="large"
                onClick={handleRestart}
              >
                再复习一次
              </IonButton>
              
              <IonButton 
                expand="block" 
                fill="outline"
                style={{ marginTop: '12px' }}
                onClick={() => history.push('/home')}
              >
                返回首页
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  const progress = (currentIndex + 1) / reviewItems.length

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>复习中心</IonTitle>
          <IonBadge slot="end" color="primary" style={{ marginRight: '16px' }}>
            {currentIndex + 1} / {reviewItems.length}
          </IonBadge>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="container">
          <div className="card">
            <IonProgressBar value={progress} color="primary"></IonProgressBar>
            <div className="flex justify-between mt-sm" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span>进度: {currentIndex + 1} / {reviewItems.length}</span>
              <span>正确率: {reviewedCount > 0 ? Math.round((correctCount / reviewedCount) * 100) : 0}%</span>
            </div>
          </div>

          <IonCard className="animate-fade-in" style={{ marginTop: '16px' }}>
            <IonCardContent>
              <div className="text-center">
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-secondary)', 
                  marginBottom: '16px' 
                }}>
                  词汇
                </div>
                
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: '700', 
                  color: 'var(--primary)',
                  marginBottom: '16px'
                }}>
                  {currentItem?.word}
                </div>

                <button
                  className="pronunciation-btn"
                  onClick={() => currentItem && playWordPronunciation(currentItem.word)}
                  style={{ marginBottom: '16px', padding: '12px 24px', fontSize: '16px' }}
                >
                  <IonIcon icon={volumeHigh} style={{ fontSize: '20px' }} />
                  <span style={{ marginLeft: '8px' }}>听发音</span>
                </button>

                {showAnswer && (
                  <div className="animate-fade-in" style={{ marginTop: '24px' }}>
                    <div style={{ 
                      padding: '16px',
                      background: 'var(--background)',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '20px',
                      textAlign: 'left'
                    }}>
                      <div style={{ 
                        fontSize: '18px', 
                        color: 'var(--secondary)',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>
                        中文释义：
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        color: 'var(--text-primary)',
                        fontWeight: '500'
                      }}>
                        {currentItem?.translation}
                      </div>
                    </div>

                    <div className="flex gap-md">
                      <IonButton 
                        expand="block"
                        color="success"
                        size="large"
                        onClick={() => handleAnswer(true)}
                        style={{ flex: 1 }}
                      >
                        <IonIcon slot="start" icon={checkmark} />
                        记住了
                      </IonButton>
                      
                      <IonButton 
                        expand="block"
                        color="danger"
                        size="large"
                        onClick={() => handleAnswer(false)}
                        style={{ flex: 1 }}
                      >
                        <IonIcon slot="start" icon={close} />
                        忘了
                      </IonButton>
                    </div>
                  </div>
                )}

                {!showAnswer && (
                  <IonButton 
                    expand="block" 
                    color="primary"
                    size="large"
                    onClick={handleShowAnswer}
                  >
                    <IonIcon icon={volumeHigh} style={{ marginRight: '8px' }} />
                    显示答案并听发音
                  </IonButton>
                )}

                <div style={{ 
                  marginTop: '20px',
                  padding: '12px',
                  background: 'rgba(52, 152, 219, 0.05)',
                  borderRadius: '8px',
                  borderLeft: '3px solid var(--primary)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  textAlign: 'left'
                }}>
                  <strong>💡 复习技巧：</strong>
                  <ul style={{ marginLeft: '16px', marginTop: '8px', marginBottom: 0 }}>
                    <li>先听发音，尝试回忆中文意思</li>
                    <li>如果记不住，说明需要更多复习</li>
                    <li>多次复习有助于长期记忆</li>
                  </ul>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="flex gap-md" style={{ marginTop: '16px' }}>
            <IonButton 
              expand="block" 
              fill="outline"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              style={{ flex: 1 }}
            >
              <IonIcon slot="start" icon={arrowBack} />
              上一题
            </IonButton>
            
            <IonButton 
              expand="block" 
              fill="outline"
              disabled={currentIndex === reviewItems.length - 1}
              onClick={handleNext}
              style={{ flex: 1 }}
            >
              下一题
              <IonIcon slot="end" icon={arrowForward} />
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default ReviewPage
