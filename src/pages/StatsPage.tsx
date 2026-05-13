import React, { useState, useEffect } from 'react'
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonBadge
} from '@ionic/react'
import { StorageService } from '../utils/storage'
import { articles } from '../data/articles'
import { calculateProgress } from '../utils/helpers'

const StatsPage: React.FC = () => {
  const [progress, setProgress] = useState(StorageService.getUserProgress())
  const [dailyStats, setDailyStats] = useState(StorageService.getDailyStats())

  useEffect(() => {
    const loadData = () => {
      setProgress(StorageService.getUserProgress())
      setDailyStats(StorageService.getDailyStats())
    }
    
    loadData()
    
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const totalArticles = articles.length
  const completedCount = progress.completedArticles.length
  const overallProgress = calculateProgress(completedCount, totalArticles)

  const a1Articles = articles.filter(a => a.level === 'A1')
  const a2Articles = articles.filter(a => a.level === 'A2')
  const completedA1 = a1Articles.filter(a => progress.completedArticles.includes(a.id)).length
  const completedA2 = a2Articles.filter(a => progress.completedArticles.includes(a.id)).length

  const getCalendarData = () => {
    const today = new Date()
    const days = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const stat = dailyStats.find(s => s.date === dateStr)
      const dayNames = ['日', '一', '二', '三', '四', '五', '六']
      
      days.push({
        day: dayNames[date.getDay()],
        date: date.getDate(),
        studied: !!stat,
        wordsReviewed: stat?.wordsReviewed || 0
      })
    }
    
    return days
  }

  const calendarData = getCalendarData()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>学习统计</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="container">
          <div className="card animate-fade-in">
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '20px',
              color: 'var(--text-primary)'
            }}>
              📊 总体进度
            </h3>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                fontSize: '64px', 
                fontWeight: '700', 
                color: 'var(--primary)',
                lineHeight: '1'
              }}>
                {overallProgress}%
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: 'var(--text-secondary)',
                marginTop: '8px'
              }}>
                完成度
              </div>
            </div>

            <div className="progress-bar" style={{ marginBottom: '8px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              {completedCount} / {totalArticles} 短文
            </div>
          </div>

          <div className="card animate-fade-in">
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: 'var(--text-primary)'
            }}>
              🎯 关键指标
            </h3>

            <div className="grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              <div style={{ 
                padding: '16px',
                background: 'var(--background)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: 'var(--secondary)',
                  marginBottom: '4px'
                }}>
                  {progress.learnedKeywords.length}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  已学词汇
                </div>
              </div>

              <div style={{ 
                padding: '16px',
                background: 'var(--background)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: 'var(--warning)',
                  marginBottom: '4px'
                }}>
                  {progress.streakDays}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  连续学习天数
                </div>
              </div>

              <div style={{ 
                padding: '16px',
                background: 'var(--background)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: 'var(--primary)',
                  marginBottom: '4px'
                }}>
                  {completedCount}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  已完成短文
                </div>
              </div>

              <div style={{ 
                padding: '16px',
                background: 'var(--background)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: 'var(--accent)',
                  marginBottom: '4px'
                }}>
                  {progress.currentLevel}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  当前级别
                </div>
              </div>
            </div>
          </div>

          <div className="card animate-fade-in">
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: 'var(--text-primary)'
            }}>
              📚 级别进度
            </h3>

            <div className="mb-lg">
              <div className="flex justify-between items-center mb-sm">
                <div className="flex items-center gap-sm">
                  <IonBadge color="success" style={{ fontSize: '12px' }}>
                    A1
                  </IonBadge>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    初级
                  </span>
                </div>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {completedA1} / {a1Articles.length}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${calculateProgress(completedA1, a1Articles.length)}%`,
                    background: 'var(--secondary)'
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-sm">
                <div className="flex items-center gap-sm">
                  <IonBadge color="primary" style={{ fontSize: '12px' }}>
                    A2
                  </IonBadge>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    中级
                  </span>
                </div>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {completedA2} / {a2Articles.length}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${calculateProgress(completedA2, a2Articles.length)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card animate-fade-in">
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: 'var(--text-primary)'
            }}>
              📅 最近7天学习日历
            </h3>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px'
            }}>
              {calendarData.map((day, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)',
                    marginBottom: '4px'
                  }}>
                    {day.day}
                  </div>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: day.studied 
                      ? 'linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%)'
                      : 'var(--background)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    color: day.studied ? 'white' : 'var(--text-light)',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {day.date}
                  </div>
                  {day.studied && (
                    <div style={{ 
                      fontSize: '10px', 
                      color: 'var(--secondary)',
                      marginTop: '4px'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card animate-fade-in">
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: 'var(--text-primary)'
            }}>
              🎯 学习目标
            </h3>

            <div style={{ 
              padding: '16px',
              background: 'var(--background)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '12px'
            }}>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  目标词汇量
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  {progress.learnedKeywords.length} / 3500
                </span>
              </div>
              <div className="progress-bar mt-sm">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${calculateProgress(progress.learnedKeywords.length, 3500)}%`,
                    background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)'
                  }}
                ></div>
              </div>
            </div>

            <div style={{ 
              padding: '16px',
              background: 'var(--background)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  目标短文数
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  {completedCount} / 150
                </span>
              </div>
              <div className="progress-bar mt-sm">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${calculateProgress(completedCount, 150)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default StatsPage
