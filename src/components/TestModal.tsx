import React, { useState, useEffect } from 'react'
import { 
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonProgressBar,
  IonBadge
} from '@ionic/react'
import { close, checkmark, closeOutline, arrowForward } from 'ionicons/icons'
import { articles } from '../data/articles'
import { StorageService } from '../utils/storage'
import { playWordPronunciation } from '../utils/helpers'
import { TestQuestion } from '../types'

interface TestModalProps {
  isOpen: boolean
  onClose: () => void
  level: 'A1' | 'A2'
}

const TestModal: React.FC<TestModalProps> = ({ isOpen, onClose, level }) => {
  const [questions, setQuestions] = useState<TestQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [testStarted, setTestStarted] = useState(false)

  useEffect(() => {
    if (isOpen && !testStarted) {
      generateTest()
    }
  }, [isOpen, testStarted])

  const generateTest = () => {
    const levelArticles = articles.filter(a => a.level === level)
    const allQuestions: TestQuestion[] = []
    
    levelArticles.slice(0, 3).forEach(article => {
      article.keywords.forEach(keyword => {
        if (Math.random() > 0.5) {
          const wrongAnswers = levelArticles
            .flatMap(a => a.keywords)
            .filter(k => k.id !== keyword.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(k => k.translation)

          const options = [keyword.translation, ...wrongAnswers].sort(() => Math.random() - 0.5)
          const correctIndex = options.indexOf(keyword.translation)

          allQuestions.push({
            id: keyword.id,
            type: 'vocabulary',
            question: `"${keyword.word}" 的中文意思是？`,
            options,
            correctAnswer: correctIndex,
            relatedKeywordId: keyword.id,
            relatedArticleId: article.id
          })
        }
      })
    })

    setQuestions(allQuestions.slice(0, 10))
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setCorrectCount(0)
    setIsFinished(false)
    setTestStarted(true)
  }

  const handleSelectAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    
    if (questions[currentIndex] && index === questions[currentIndex].correctAnswer) {
      setCorrectCount(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setIsFinished(true)
      
      const score = Math.round((correctCount / questions.length) * 100)
      const dailyStat = {
        date: new Date().toISOString().split('T')[0],
        articlesLearned: 0,
        wordsReviewed: 0,
        testScore: score,
        studyTime: 0
      }
      StorageService.saveDailyStat(dailyStat)
    }
  }

  const handleClose = () => {
    setTestStarted(false)
    onClose()
  }

  const currentQuestion = questions[currentIndex]
  const progress = (currentIndex + 1) / questions.length

  if (!testStarted) {
    return (
      <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
        <IonContent>
          <div className="container" style={{ paddingTop: '100px' }}>
            <div className="card text-center">
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>📝</div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                {level} 级别测试
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                测试您的词汇和理解能力
              </p>
              <div style={{ 
                padding: '16px',
                background: 'var(--background)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  测试内容
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  10道选择题
                </div>
              </div>
              <IonButton expand="block" color="primary" size="large" onClick={generateTest}>
                开始测试
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>
    )
  }

  if (isFinished) {
    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0
    
    return (
      <IonModal isOpen={isOpen} onDidDismiss={handleClose} backdrop-dismiss={false}>
        <IonContent>
          <div className="container" style={{ paddingTop: '80px' }}>
            <div className="card text-center animate-fade-in">
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>
                {score >= 80 ? '🏆' : score >= 60 ? '👍' : '💪'}
              </div>
              
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                测试完成！
              </h2>
              
              <div style={{ 
                fontSize: '64px', 
                fontWeight: '700', 
                color: score >= 60 ? 'var(--secondary)' : 'var(--accent)',
                marginBottom: '16px'
              }}>
                {score}%
              </div>
              
              <p style={{ 
                fontSize: '16px', 
                color: 'var(--text-secondary)', 
                marginBottom: '24px'
              }}>
                {score >= 80 ? '太棒了！继续保持！' : 
                 score >= 60 ? '不错！继续加油！' : 
                 '需要多加练习哦！'}
              </p>

              <div className="flex justify-center gap-lg" style={{ marginBottom: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: '700', 
                    color: 'var(--primary)'
                  }}>
                    {correctCount}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    正确
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: '700', 
                    color: 'var(--accent)'
                  }}>
                    {questions.length - correctCount}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    错误
                  </div>
                </div>
              </div>

              <IonButton expand="block" color="primary" onClick={handleClose}>
                返回学习
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>
    )
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>测试</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleClose}>
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="container">
          <div className="card">
            <div className="flex justify-between items-center mb-md">
              <IonBadge color="primary">
                第 {currentIndex + 1} / {questions.length} 题
              </IonBadge>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                正确: {correctCount}
              </span>
            </div>
            <IonProgressBar value={progress}></IonProgressBar>
          </div>

          <IonCard className="animate-fade-in" style={{ marginTop: '16px' }}>
            <IonCardContent>
              <div style={{ 
                fontSize: '14px', 
                color: 'var(--text-secondary)',
                marginBottom: '12px'
              }}>
                词汇题
              </div>
              
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '600',
                marginBottom: '24px',
                color: 'var(--text-primary)'
              }}>
                {currentQuestion.question}
              </div>

              <div className="flex flex-col gap-sm">
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = index === currentQuestion.correctAnswer
                  const isSelected = selectedAnswer === index
                  
                  let backgroundColor = 'var(--background)'
                  let borderColor = 'var(--border)'
                  let textColor = 'var(--text-primary)'
                  
                  if (showResult) {
                    if (isCorrect) {
                      backgroundColor = 'rgba(46, 204, 113, 0.1)'
                      borderColor = 'var(--secondary)'
                      textColor = 'var(--secondary)'
                    } else if (isSelected && !isCorrect) {
                      backgroundColor = 'rgba(231, 76, 60, 0.1)'
                      borderColor = 'var(--accent)'
                      textColor = 'var(--accent)'
                    }
                  }
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      style={{
                        padding: '16px',
                        background: backgroundColor,
                        border: `2px solid ${borderColor}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: showResult ? 'default' : 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span style={{ 
                          fontSize: '15px', 
                          fontWeight: '500',
                          color: textColor
                        }}>
                          {option}
                        </span>
                        {showResult && isCorrect && (
                          <IonIcon icon={checkmark} color="success" style={{ fontSize: '24px' }} />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <IonIcon icon={closeOutline} color="danger" style={{ fontSize: '24px' }} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {showResult && (
                <div className="animate-fade-in" style={{ marginTop: '24px' }}>
                  <IonButton 
                    expand="block" 
                    color="primary"
                    onClick={handleNext}
                  >
                    {currentIndex < questions.length - 1 ? (
                      <>
                        下一题
                        <IonIcon slot="end" icon={arrowForward} />
                      </>
                    ) : (
                      '完成测试'
                    )}
                  </IonButton>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonModal>
  )
}

export default TestModal
