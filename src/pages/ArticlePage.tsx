import React, { useState, useEffect, useRef } from 'react'
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonBackButton, 
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
  IonModal,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react'
import { useParams, useHistory } from 'react-router-dom'
import { volumeHigh, checkmark, arrowForward, arrowBack, play, pause, settings, book } from 'ionicons/icons'
import { getArticleById, articles } from '../data/articles'
import { StorageService } from '../utils/storage'
import { getLevelLabel } from '../utils/helpers'
import { Keyword } from '../types'

const SPEECH_CONFIGS = {
  ultraSlow: { rate: 0.35, pitch: 1.2 },
  verySlow: { rate: 0.45, pitch: 1.15 },
  slow: { rate: 0.55, pitch: 1.1 }
}

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const articleId = parseInt(id || '1')
  const article = getArticleById(articleId)
  
  const [showVocabulary, setShowVocabulary] = useState(false)
  const [learnedKeywords, setLearnedKeywords] = useState<number[]>([])
  const [showAllKeywords, setShowAllKeywords] = useState(false)
  const [speechConfig, setSpeechConfig] = useState<keyof typeof SPEECH_CONFIGS>('slow')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(-1)
  const [showSpeedSettings, setShowSpeedSettings] = useState(false)
  const [showPhoneticGuide, setShowPhoneticGuide] = useState(false)
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const sentencesRef = useRef<string[]>([])

  useEffect(() => {
    if (article) {
      article.keywords.forEach(keyword => {
        StorageService.createLearningRecord(articleId, keyword.id)
      })
      
      const progress = StorageService.getUserProgress()
      setLearnedKeywords(progress.learnedKeywords)
      sentencesRef.current = article.content.split('\n\n').filter(s => s.trim())
    }
    
    return () => {
      stopSpeaking()
    }
  }, [articleId])

  if (!article) {
    return (
      <IonPage>
        <IonContent>
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <p>文章不存在</p>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  const playWord = (word: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'es-ES'
      utterance.rate = SPEECH_CONFIGS[speechConfig].rate
      utterance.pitch = SPEECH_CONFIGS[speechConfig].pitch
      utterance.volume = 1.0
      speechSynthesis.speak(utterance)
    }
  }

  const speakSentence = (sentence: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(sentence)
      utterance.lang = 'es-ES'
      utterance.rate = SPEECH_CONFIGS[speechConfig].rate
      utterance.pitch = SPEECH_CONFIGS[speechConfig].pitch
      utterance.volume = 1.0
      
      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentSentence(-1)
      }
      
      utteranceRef.current = utterance
      speechSynthesis.speak(utterance)
    }
  }

  const playAllSentences = () => {
    if ('speechSynthesis' in window) {
      stopSpeaking()
      setIsPlaying(true)
      playSentenceByIndex(0)
    }
  }

  const playSentenceByIndex = (index: number) => {
    if (index < sentencesRef.current.length) {
      setCurrentSentence(index)
      const utterance = new SpeechSynthesisUtterance(sentencesRef.current[index])
      utterance.lang = 'es-ES'
      utterance.rate = SPEECH_CONFIGS[speechConfig].rate
      utterance.pitch = SPEECH_CONFIGS[speechConfig].pitch
      utterance.volume = 1.0
      
      utterance.onend = () => {
        const nextIndex = index + 1
        if (nextIndex < sentencesRef.current.length) {
          setTimeout(() => playSentenceByIndex(nextIndex), 600)
        } else {
          setIsPlaying(false)
          setCurrentSentence(-1)
        }
      }
      
      utteranceRef.current = utterance
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentSentence(-1)
      utteranceRef.current = null
    }
  }

  const handleMarkKeywordLearned = (keywordId: number) => {
    StorageService.markKeywordLearned(keywordId)
    setLearnedKeywords(prev => [...prev, keywordId])
  }

  const handleNextArticle = () => {
    stopSpeaking()
    const nextId = articleId + 1
    if (nextId <= articles.length) {
      history.push(`/article/${nextId}`)
      window.location.reload()
    }
  }

  const handlePrevArticle = () => {
    stopSpeaking()
    const prevId = articleId - 1
    if (prevId >= 1) {
      history.push(`/article/${prevId}`)
      window.location.reload()
    }
  }

  const handleCompleteArticle = () => {
    StorageService.markArticleCompleted(articleId)
    StorageService.updateStreak()
    
    const dailyStat = {
      date: new Date().toISOString().split('T')[0],
      articlesLearned: 1,
      wordsReviewed: 0,
      testScore: 0,
      studyTime: 0
    }
    StorageService.saveDailyStat(dailyStat)
    
    handleNextArticle()
  }

  const getSyllables = (word: string): string[] => {
    const syllables: string[] = []
    let current = ''
    const vowels = 'aeiouáéíóúü'
    const consonants = 'bcdfghjklmnpqrstvwxyz'
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase()
      current += word[i]
      
      if (vowels.includes(char)) {
        if (current.length > 0) {
          syllables.push(current)
          current = ''
        }
      }
    }
    
    if (current.length > 0) {
      syllables[syllables.length - 1] += current
    }
    
    return syllables.length > 0 ? syllables : [word]
  }

  const renderContentWithKeywords = () => {
    const content = article.content
    const result: React.ReactNode[] = []

    const sentences = content.split('\n\n')
    
    sentences.forEach((sentence, sentenceIndex) => {
      const words = sentence.split(' ')
      const sentenceElements: React.ReactNode[] = []
      
      words.forEach((word, wordIndex) => {
        const cleanWord = word.replace(/[.,;:!?]/g, '').toLowerCase()
        const keyword = article.keywords.find(k => k.word.toLowerCase() === cleanWord)
        
        if (keyword) {
          const isLearned = learnedKeywords.includes(keyword.id)
          sentenceElements.push(
            <span
              key={`${sentenceIndex}-${wordIndex}`}
              className="keyword-highlight"
              onClick={() => playWord(keyword.word)}
              style={{
                backgroundColor: isLearned 
                  ? 'rgba(46, 204, 113, 0.2)' 
                  : 'rgba(52, 152, 219, 0.15)',
                color: isLearned ? 'var(--secondary)' : 'var(--primary)'
              }}
              title={`${keyword.translation}`}
            >
              {word}
            </span>
          )
        } else {
          sentenceElements.push(<span key={`${sentenceIndex}-${wordIndex}`}>{word}</span>)
        }
        
        if (wordIndex < words.length - 1) {
          sentenceElements.push(<span key={`space-${sentenceIndex}-${wordIndex}`}> </span>)
        }
      })
      
      result.push(
        <div 
          key={sentenceIndex}
          onClick={() => speakSentence(sentence)}
          style={{
            marginBottom: '16px',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: currentSentence === sentenceIndex 
              ? 'rgba(52, 152, 219, 0.1)' 
              : 'transparent',
            border: currentSentence === sentenceIndex 
              ? '2px solid var(--primary)' 
              : '2px solid transparent'
          }}
        >
          <p style={{ 
            lineHeight: '2', 
            fontSize: '16px',
            margin: 0
          }}>
            {sentenceElements}
          </p>
          <div style={{
            fontSize: '12px',
            color: 'var(--text-light)',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>点击此句听朗读</span>
            {currentSentence === sentenceIndex && (
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                🔊 正在朗读...
              </span>
            )}
          </div>
        </div>
      )
    })
    
    return result
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/learn" text="" />
          </IonButtons>
          <IonTitle>{article.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowSpeedSettings(!showSpeedSettings)}>
              <IonIcon icon={settings} />
            </IonButton>
            <IonButton onClick={() => setShowVocabulary(true)}>
              📖 词汇
              <IonBadge color="primary" style={{ marginLeft: '4px' }}>
                {article.keywords.length}
              </IonBadge>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="container">
          {showSpeedSettings && (
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                ⚙️ 发音速度设置
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {(['ultraSlow', 'verySlow', 'slow'] as const).map(config => (
                  <button
                    key={config}
                    onClick={() => setSpeechConfig(config)}
                    style={{
                      padding: '10px 14px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: speechConfig === config 
                        ? 'rgba(255,255,255,0.3)' 
                        : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: speechConfig === config ? '700' : '400',
                      fontSize: '13px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {config === 'ultraSlow' ? '🐢 极慢速' : 
                     config === 'verySlow' ? '🐢 慢速' : '🚶 正常'}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '11px', opacity: 0.9, marginBottom: '8px' }}>
                💡 建议初学者选择"极慢速"，每个音节更清晰
              </p>
              
              <div style={{
                marginTop: '12px',
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px'
              }}>
                <strong>⚠️ 重要提示：</strong>
                <p style={{ marginTop: '6px', marginBottom: 0 }}>
                  由于浏览器内置发音限制，若发音仍不够清晰，建议配合以下方式学习：
                </p>
                <ul style={{ marginLeft: '14px', marginTop: '4px', marginBottom: 0 }}>
                  <li>查看词汇表中的音标和发音技巧</li>
                  <li>注意音节划分，尝试自己拼读</li>
                  <li>有条件可参考专业西班牙语教材音频</li>
                </ul>
              </div>
            </div>
          )}

          <div className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
            <div 
              className="illustration"
              style={{
                background: article.level === 'A1' 
                  ? 'linear-gradient(135deg, #3498db 0%, #2ecc71 100%)'
                  : 'linear-gradient(135deg, #9b59b6 0%, #3498db 100%)',
                margin: 0,
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
              }}
            >
              {article.illustration}
            </div>

            <div style={{ padding: '20px' }}>
              <div className="flex items-center gap-md mb-md">
                <span className={`level-badge level-${article.level}`}>
                  {article.level} {getLevelLabel(article.level)}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  第 {article.order} 篇
                </span>
              </div>

              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                marginBottom: '4px',
                color: 'var(--text-primary'
              }}>
                {article.titleCN}
              </h2>

              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <IonButton 
                    expand="block" 
                    color="primary"
                    onClick={playAllSentences}
                    disabled={isPlaying}
                    style={{ flex: 1 }}
                  >
                    <IonIcon slot="start" icon={play} />
                    全文朗读
                  </IonButton>
                  
                  {isPlaying && (
                    <IonButton 
                      expand="block" 
                      color="warning"
                      onClick={stopSpeaking}
                      style={{ flex: 1 }}
                    >
                      <IonIcon slot="start" icon={pause} />
                      停止
                    </IonButton>
                  )}
                </div>

                <div style={{ 
                  padding: '12px',
                  background: 'rgba(231, 76, 60, 0.05)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  borderLeft: '3px solid var(--accent)'
                }}>
                  <p style={{ marginBottom: '8px' }}>⚠️ <strong>发音说明：</strong></p>
                  <ul style={{ marginLeft: '16px', marginBottom: 0 }}>
                    <li>浏览器内置发音有限，若不够清晰请见谅</li>
                    <li>建议先调节到"极慢速"模式</li>
                    <li>配合下方词汇表学习音标和发音技巧</li>
                    <li>重点词汇已标注音标和发音说明</li>
                  </ul>
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
              📖 短文内容
            </h3>
            
            <div style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
              {renderContentWithKeywords()}
            </div>
            
            <div style={{ 
              fontSize: '13px', 
              color: 'var(--text-secondary)', 
              marginTop: '16px',
              fontStyle: 'italic',
              padding: '12px',
              background: 'rgba(52, 152, 219, 0.05)',
              borderRadius: '8px',
              borderLeft: '3px solid var(--primary)'
            }}>
              💡 <strong>学习建议：</strong>先听朗读建立语感，再点击高亮词汇学习发音，最后尝试跟读模仿
            </div>
          </div>

          <div className="card animate-fade-in">
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: 'var(--text-primary)'
            }}>
              💡 重点词组
            </h3>
            
            {article.phrases.map((phrase, index) => (
              <div 
                key={index}
                style={{ 
                  padding: '12px',
                  background: 'var(--background)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: index < article.phrases.length - 1 ? '12px' : 0
                }}
              >
                <div style={{ 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  color: 'var(--primary)',
                  marginBottom: '4px'
                }}>
                  {phrase.phrase}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-secondary)',
                  marginBottom: '4px'
                }}>
                  {phrase.translation}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--text-light)'
                }}>
                  {phrase.usage}
                </div>
              </div>
            ))}
          </div>

          <div className="card animate-fade-in">
            <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                📝 核心词汇
              </h3>
              <IonButton 
                fill="clear" 
                size="small"
                onClick={() => setShowPhoneticGuide(!showPhoneticGuide)}
              >
                <IonIcon icon={book} slot="start" />
                {showPhoneticGuide ? '隐藏音节' : '显示音节'}
              </IonButton>
            </div>
            
            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
              {article.keywords.slice(0, showAllKeywords ? undefined : 6).map(keyword => {
                const isLearned = learnedKeywords.includes(keyword.id)
                const syllables = showPhoneticGuide ? getSyllables(keyword.word) : []
                
                return (
                  <div
                    key={keyword.id}
                    onClick={() => playWord(keyword.word)}
                    style={{
                      padding: '8px 16px',
                      background: isLearned 
                        ? 'rgba(46, 204, 113, 0.1)' 
                        : 'rgba(52, 152, 219, 0.1)',
                      borderRadius: '20px',
                      border: `2px solid ${isLearned ? 'var(--secondary)' : 'var(--primary)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexDirection: 'column',
                      minWidth: '100px'
                    }}
                  >
                    <div className="flex items-center gap-sm">
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: isLearned ? 'var(--secondary)' : 'var(--primary)'
                      }}>
                        {keyword.word}
                      </span>
                      <span style={{ fontSize: '16px' }}>🔊</span>
                    </div>
                    {showPhoneticGuide && syllables.length > 1 && (
                      <div style={{ 
                        fontSize: '11px', 
                        color: 'var(--text-secondary)',
                        fontWeight: '500'
                      }}>
                        {syllables.join(' · ')}
                      </div>
                    )}
                    <div style={{ 
                      fontSize: '10px', 
                      color: 'var(--text-light)'
                    }}>
                      {keyword.translation}
                    </div>
                  </div>
                )
              })}
            </div>

            {article.keywords.length > 6 && (
              <IonButton 
                expand="block" 
                fill="clear" 
                onClick={() => setShowAllKeywords(!showAllKeywords)}
                style={{ marginTop: '12px' }}
              >
                {showAllKeywords ? '收起' : `查看全部 ${article.keywords.length} 个词汇`}
              </IonButton>
            )}
          </div>

          <div className="flex gap-md" style={{ marginTop: '24px', marginBottom: '32px' }}>
            <IonButton 
              expand="block" 
              fill="outline"
              disabled={articleId <= 1}
              onClick={handlePrevArticle}
              style={{ flex: 1 }}
            >
              <IonIcon slot="start" icon={arrowBack} />
              上一篇
            </IonButton>
            
            <IonButton 
              expand="block" 
              color="success"
              onClick={handleCompleteArticle}
              style={{ flex: 1 }}
            >
              完成学习
              <IonIcon slot="end" icon={checkmark} />
            </IonButton>
            
            <IonButton 
              expand="block" 
              fill="outline"
              disabled={articleId >= articles.length}
              onClick={handleNextArticle}
              style={{ flex: 1 }}
            >
              下一篇
              <IonIcon slot="end" icon={arrowForward} />
            </IonButton>
          </div>
        </div>

        <IonModal isOpen={showVocabulary} onDidDismiss={() => setShowVocabulary(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>词汇表（含发音技巧）</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowVocabulary(false)}>关闭</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {article.keywords.map(keyword => {
                const isLearned = learnedKeywords.includes(keyword.id)
                const syllables = getSyllables(keyword.word)
                
                return (
                  <IonItem key={keyword.id}>
                    <div slot="start" style={{ marginRight: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        className="pronunciation-btn"
                        onClick={() => playWord(keyword.word)}
                        style={{ padding: '8px 14px', fontSize: '13px' }}
                      >
                        🔊 听发音
                      </button>
                      {syllables.length > 1 && (
                        <div style={{ 
                          fontSize: '11px', 
                          color: 'var(--text-secondary)',
                          textAlign: 'center',
                          fontWeight: '600'
                        }}>
                          {syllables.join(' · ')}
                        </div>
                      )}
                    </div>
                    <IonLabel>
                      <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary)' }}>
                        {keyword.word}
                      </h2>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {keyword.translation}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                        音标: {keyword.phonetic}
                      </p>
                      {keyword.examples.length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                          <p style={{ 
                            fontSize: '13px', 
                            color: 'var(--text-secondary)', 
                            fontStyle: 'italic',
                            marginBottom: '4px'
                          }}>
                            例句：
                          </p>
                          <p 
                            style={{ 
                              fontSize: '13px', 
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              fontStyle: 'italic'
                            }}
                            onClick={() => speakSentence(keyword.examples[0])}
                          >
                            {keyword.examples[0]} 🔊
                          </p>
                        </div>
                      )}
                    </IonLabel>
                    <IonButton 
                      slot="end"
                      fill={isLearned ? 'solid' : 'outline'}
                      color={isLearned ? 'success' : 'medium'}
                      size="small"
                      onClick={() => handleMarkKeywordLearned(keyword.id)}
                      disabled={isLearned}
                    >
                      {isLearned ? '✓ 已掌握' : '标记'}
                    </IonButton>
                  </IonItem>
                )
              })}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  )
}

export default ArticlePage
