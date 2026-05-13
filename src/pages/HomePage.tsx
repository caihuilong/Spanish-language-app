import React, { useState, useEffect } from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonBadge } from '@ionic/react'
import { useHistory } from 'react-router-dom'
import { play, repeat } from 'ionicons/icons'
import { StorageService } from '../utils/storage'
import { articles, getArticleCountByLevel } from '../data/articles'
import { calculateProgress, getNextArticleId } from '../utils/helpers'

const HomePage: React.FC = () => {
  const history = useHistory()
  const [progress, setProgress] = useState(StorageService.getUserProgress())
  const [reviewCount, setReviewCount] = useState(0)

  useEffect(() => {
    const loadData = () => {
      setProgress(StorageService.getUserProgress())
      const reviewItems = StorageService.getReviewItems()
      setReviewCount(reviewItems.length)
    }
    
    loadData()
    
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const totalArticles = articles.length
  const completedCount = progress.completedArticles.length
  const progressPercent = calculateProgress(completedCount, totalArticles)
  const nextArticleId = getNextArticleId(progress.currentArticleId, progress.completedArticles)
  const a1Count = getArticleCountByLevel('A1')
  const a2Count = getArticleCountByLevel('A2')

  const handleStartLearning = () => {
    history.push(`/article/${nextArticleId}`)
  }

  const handleStartReview = () => {
    history.push('/review')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>西语学习伴侣</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="container">
          <div className="text-center" style={{ padding: '20px 0' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>🇪🇸</div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--text-primary)' }}>
              欢迎回来！
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              继续你的西班牙语学习之旅
            </p>
          </div>

          <IonCard className="animate-fade-in">
            <IonCardHeader>
              <IonCardTitle style={{ fontSize: '18px', fontWeight: '600' }}>
                📊 学习进度
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="mb-md">
                <div className="flex justify-between mb-sm">
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    已完成短文
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {completedCount} / {totalArticles}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between" style={{ marginTop: '16px' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--secondary)' }}>
                    {progress.learnedKeywords.length}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    已学词汇
                  </div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--warning)' }}>
                    {progress.streakDays}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    连续天数
                  </div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                    {progress.currentLevel}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    当前级别
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {reviewCount > 0 && (
            <IonCard 
              className="animate-fade-in" 
              style={{ 
                background: 'linear-gradient(135deg, var(--warning) 0%, #e67e22 100%)',
                color: 'white',
                cursor: 'pointer'
              }}
              onClick={handleStartReview}
            >
              <IonCardContent>
                <div className="flex items-center gap-md">
                  <IonIcon icon={repeat} style={{ fontSize: '32px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      📝 待复习内容
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                      您有 {reviewCount} 个词汇需要复习
                    </div>
                  </div>
                  <IonIcon name="chevron-forward" style={{ fontSize: '24px' }} />
                </div>
              </IonCardContent>
            </IonCard>
          )}

          <IonCard>
            <IonCardContent>
              <div className="flex gap-sm mb-md" style={{ flexWrap: 'wrap' }}>
                <IonBadge color="success" style={{ fontSize: '12px' }}>
                  A1: {a1Count}篇
                </IonBadge>
                <IonBadge color="primary" style={{ fontSize: '12px' }}>
                  A2: {a2Count}篇
                </IonBadge>
                <IonBadge color="medium" style={{ fontSize: '12px' }}>
                  目标: 3500词
                </IonBadge>
              </div>

              <IonButton 
                expand="block" 
                color="primary" 
                size="large"
                onClick={handleStartLearning}
              >
                <IonIcon slot="start" icon={play} />
                {completedCount === 0 ? '开始学习' : '继续学习'}
              </IonButton>

              {reviewCount > 0 && (
                <IonButton 
                  expand="block" 
                  color="warning" 
                  size="default"
                  style={{ marginTop: '12px' }}
                  onClick={handleStartReview}
                >
                  <IonIcon slot="start" icon={repeat} />
                  复习 ({reviewCount})
                </IonButton>
              )}
            </IonCardContent>
          </IonCard>

          <IonCard className="animate-fade-in">
            <IonCardHeader>
              <IonCardTitle style={{ fontSize: '18px', fontWeight: '600' }}>
                🎯 学习小贴士
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                <p className="mb-sm">✨ 每天学习新内容，温习旧知识</p>
                <p className="mb-sm">🎧 多听发音，模仿语调</p>
                <p className="mb-sm">📝 结合句子记忆单词</p>
                <p>🔄 及时复习，防止遗忘</p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default HomePage
