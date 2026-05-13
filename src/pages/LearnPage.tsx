import React, { useState, useEffect } from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardContent, IonBadge, IonIcon } from '@ionic/react'
import { useHistory } from 'react-router-dom'
import { checkmarkCircle, lockClosed } from 'ionicons/icons'
import { getArticlesByLevel } from '../data/articles'
import { StorageService } from '../utils/storage'
import { getLevelLabel, calculateProgress } from '../utils/helpers'

const LearnPage: React.FC = () => {
  const history = useHistory()
  const [segment, setSegment] = useState<'A1' | 'A2'>('A1')
  const [completedArticles, setCompletedArticles] = useState<number[]>([])

  useEffect(() => {
    const progress = StorageService.getUserProgress()
    setCompletedArticles(progress.completedArticles)
  }, [])

  const filteredArticles = getArticlesByLevel(segment)
  const completedCount = filteredArticles.filter(a => completedArticles.includes(a.id)).length
  const totalCount = filteredArticles.length
  const progressPercent = calculateProgress(completedCount, totalCount)

  const handleArticleClick = (articleId: number) => {
    history.push(`/article/${articleId}`)
  }

  const getArticleStatus = (articleId: number) => {
    if (completedArticles.includes(articleId)) {
      return 'completed'
    }
    const articleIndex = filteredArticles.findIndex(a => a.id === articleId)
    const completedInLevel = filteredArticles.filter((a, idx) => 
      idx < articleIndex && completedArticles.includes(a.id)
    ).length
    
    if (articleIndex === 0 || completedInLevel > 0 || completedCount > articleIndex - 1) {
      return 'available'
    }
    return 'locked'
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>学习中心</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value as 'A1' | 'A2')}>
            <IonSegmentButton value="A1">
              <IonLabel>A1 初级</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="A2">
              <IonLabel>A2 中级</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="container">
          <div className="card">
            <div className="flex justify-between items-center mb-md">
              <span style={{ fontSize: '16px', fontWeight: '600' }}>
                {getLevelLabel(segment)} 进度
              </span>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {completedCount} / {totalCount} 已完成
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div style={{ padding: '8px 0' }}>
            {filteredArticles.map((article) => {
              const status = getArticleStatus(article.id)
              const isCompleted = status === 'completed'
              
              return (
                <IonCard 
                  key={article.id}
                  className="animate-slide-in"
                  style={{ 
                    cursor: status === 'locked' ? 'not-allowed' : 'pointer',
                    opacity: status === 'locked' ? 0.5 : 1,
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => status !== 'locked' && handleArticleClick(article.id)}
                >
                  <IonCardContent>
                    <div className="flex gap-md items-center">
                      <div 
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '12px',
                          background: isCompleted 
                            ? 'linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%)'
                            : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          flexShrink: 0
                        }}
                      >
                        {status === 'completed' ? (
                          <IonIcon icon={checkmarkCircle} color="light" style={{ fontSize: '32px' }} />
                        ) : status === 'locked' ? (
                          <IonIcon icon={lockClosed} color="light" style={{ fontSize: '24px' }} />
                        ) : (
                          article.illustration
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center gap-sm mb-xs">
                          <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {article.title}
                          </span>
                          <span className={`level-badge level-${article.level}`}>
                            {article.level}
                          </span>
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          {article.titleCN}
                        </div>
                        <div className="flex gap-sm">
                          <IonBadge color="medium" style={{ fontSize: '11px' }}>
                            {article.keywords.length} 词汇
                          </IonBadge>
                          {isCompleted && (
                            <IonBadge color="success" style={{ fontSize: '11px' }}>
                              已完成
                            </IonBadge>
                          )}
                        </div>
                      </div>

                      {status !== 'locked' && (
                        <IonIcon 
                          name="chevron-forward" 
                          style={{ 
                            fontSize: '24px', 
                            color: 'var(--text-light)',
                            flexShrink: 0
                          }} 
                        />
                      )}
                    </div>
                  </IonCardContent>
                </IonCard>
              )
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default LearnPage
