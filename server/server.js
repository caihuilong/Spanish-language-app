const express = require('express')
const cors = require('cors')
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 3003
const audioDir = path.join(__dirname, 'audios')

app.use(cors())
app.use(express.json({ limit: '10mb' }))

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true })
}

app.post('/synthesize', async (req, res) => {
  try {
    const { text, voice = 'es-ES-AlvaroNeural', rate = '-20%' } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    const filename = `tts_${uuidv4()}.mp3`
    const filepath = path.join(audioDir, filename)

    console.log(`🎤 正在生成发音: ${text.substring(0, 30)}...`)
    console.log(`   语音: ${voice}`)
    console.log(`   语速: ${rate}`)

    const command = process.platform === 'win32' ? 'edge-tts.cmd' : 'edge-tts'
    const args = ['--text', text, '--voice', voice, '--rate', rate, '--write-media', filepath]

    const ttsProcess = spawn(command, args)

    ttsProcess.on('error', (err) => {
      console.error('Edge TTS error:', err.message)
      res.status(500).json({ 
        error: 'Edge TTS not found',
        hint: 'Run: pip install edge-tts'
      })
    })

    ttsProcess.on('close', (code) => {
      if (code === 0 && fs.existsSync(filepath)) {
        res.json({
          success: true,
          filename,
          path: `/audios/${filename}`
        })
      } else {
        res.status(500).json({ error: 'TTS synthesis failed' })
      }
    })

  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.use('/audios', express.static(audioDir))

app.get('/voices', (req, res) => {
  res.json({
    success: true,
    voices: [
      { id: 'es-ES-AlvaroNeural', name: 'Álvaro (西班牙男声)', recommended: true },
      { id: 'es-ES-ElviraNeural', name: 'Elvira (西班牙女声)' },
      { id: 'es-MX-DaliaNeural', name: 'Dalia (墨西哥女声)' },
      { id: 'es-MX-JorgeNeural', name: 'Jorge (墨西哥男声)' },
      { id: 'es-AR-TomasNeural', name: 'Tomás (阿根廷男声)' },
      { id: 'es-AR-FatimaNeural', name: 'Fatima (阿根廷女声)' },
      { id: 'es-CO-GonzaloNeural', name: 'Gonzalo (哥伦比亚)' },
      { id: 'es-CL-CamilaNeural', name: 'Camila (智利女声)' },
      { id: 'es-PE-CamilaNeural', name: 'Camila (秘鲁女声)' }
    ],
    default: 'es-ES-AlvaroNeural',
    defaultRate: '-20%'
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Edge TTS' })
})

app.listen(PORT, () => {
  console.log('🎤 Edge TTS发音服务已启动')
  console.log(`   http://localhost:${PORT}`)
  console.log('')
  console.log('推荐配置:')
  console.log('   语音: es-ES-AlvaroNeural (西班牙男声)')
  console.log('   语速: -20% (慢速)')
  console.log('')
})

setInterval(() => {
  const files = fs.readdirSync(audioDir)
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  files.forEach(file => {
    const filepath = path.join(audioDir, file)
    const stats = fs.statSync(filepath)
    if (stats.mtimeMs < oneHourAgo) {
      fs.unlinkSync(filepath)
    }
  })
}, 60000)

process.on('SIGINT', () => {
  console.log('\n🛑 停止发音服务')
  process.exit()
})
