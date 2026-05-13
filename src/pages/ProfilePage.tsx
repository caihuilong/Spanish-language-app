import React, { useState, useEffect } from 'react'
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonAlert,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/react'
import { trophy, flame, book, trash, informationCircle, helpCircle, mail } from 'ionicons/icons'
import { StorageService } from '../utils/storage'
import { formatDate } from '../utils/helpers'

const ProfilePage: React.FC = () => {
  const [progress, setProgress] = useState(StorageService.getUserProgress())
  const [showResetAlert, setShowResetAlert] = useState(false)

  useEffect(() => {
    const loadData = () => {
      setProgress(StorageService.getUserProgress())
    }
    
    loadData()
    
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleResetProgress = () => {
    StorageService.clearAllData()
    setProgress(StorageService.getUserProgress())
    setShowResetAlert(false)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>我的</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="container">
          <div className="card text-center animate-fade-in">
            <div style={{ 
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '40px'
            }}>
              👤
            </div>
            
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              marginBottom: '4px',
              color: 'var(--text-primary)'
            }}>
              西班牙语学习者
            </h2>
            
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)'
            }}>
              学习天数: {progress.streakDays} 天
            </p>
          </div>

          <IonCard className="animate-fade-in">
            <IonCardHeader>
              <IonCardTitle style={{ fontSize: '18px', fontWeight: '600' }}>
                🏆 学习成就
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={trophy} style={{ 
                    fontSize: '32px', 
                    color: 'var(--warning)',
                    marginBottom: '8px'
                  }} />
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {progress.learnedKeywords.length}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    词汇
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={book} style={{ 
                    fontSize: '32px', 
                    color: 'var(--primary)',
                    marginBottom: '8px'
                  }} />
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {progress.completedArticles.length}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    短文
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={flame} style={{ 
                    fontSize: '32px', 
                    color: 'var(--accent)',
                    marginBottom: '8px'
                  }} />
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {progress.streakDays}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    连续天数
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="animate-fade-in">
            <IonCardHeader>
              <IonCardTitle style={{ fontSize: '18px', fontWeight: '600' }}>
                📋 学习信息
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="none">
                <IonItem>
                  <IonLabel>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      当前级别
                    </p>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: 'var(--primary)'
                    }}>
                      {progress.currentLevel} 级
                    </h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      最近学习
                    </p>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600'
                    }}>
                      {formatDate(progress.lastStudyDate)}
                    </h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      已学词汇
                    </p>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600'
                    }}>
                      {progress.learnedKeywords.length} 个
                    </h3>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          <IonCard className="animate-fade-in">
            <IonCardHeader>
              <IonCardTitle style={{ fontSize: '18px', fontWeight: '600' }}>
                ⚙️ 设置
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="none">
                <IonItem button detail>
                  <IonIcon slot="start" icon={helpCircle} color="primary" />
                  <IonLabel>
                    <h3 style={{ fontSize: '15px' }}>帮助与反馈</h3>
                  </IonLabel>
                </IonItem>

                <IonItem button detail>
                  <IonIcon slot="start" icon={informationCircle} color="primary" />
                  <IonLabel>
                    <h3 style={{ fontSize: '15px' }}>关于我们</h3>
                  </IonLabel>
                </IonItem>

                <IonItem button detail>
                  <IonIcon slot="start" icon={mail} color="primary" />
                  <IonLabel>
                    <h3 style={{ fontSize: '15px' }}>联系我们</h3>
                  </IonLabel>
                </IonItem>

                <IonItem 
                  button 
                  onClick={() => setShowResetAlert(true)}
                  style={{ color: 'var(--accent)' }}
                >
                  <IonIcon slot="start" icon={trash} color="danger" />
                  <IonLabel>
                    <h3 style={{ fontSize: '15px' }}>重置学习进度</h3>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          <div className="card animate-fade-in" style={{ textAlign: 'center' }}>
            <p style={{ 
              fontSize: '13px', 
              color: 'var(--text-light)',
              marginBottom: '8px'
            }}>
              西语学习伴侣 v1.0.0
            </p>
            <p style={{ 
              fontSize: '12px', 
              color: 'var(--text-light)'
            }}>
              专为西班牙语A1-A2学习者设计
            </p>
          </div>
        </div>

        <IonAlert
          isOpen={showResetAlert}
          onDidDismiss={() => setShowResetAlert(false)}
          header="确认重置"
          message="确定要重置所有学习进度吗？此操作不可恢复。"
          buttons={[
            {
              text: '取消',
              role: 'cancel',
              handler: () => setShowResetAlert(false)
            },
            {
              text: '确定重置',
              role: 'destructive',
              handler: handleResetProgress
            }
          ]}
        />
      </IonContent>
    </IonPage>
  )
}

export default ProfilePage
