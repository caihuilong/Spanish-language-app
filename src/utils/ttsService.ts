const TTS_SERVER_PORT = 3003

let server: any = null
let isRunning = false

export const startTTSService = async (): Promise<boolean> => {
  if (isRunning) {
    console.log('🎤 TTS服务已在运行')
    return true
  }

  try {
    const { spawn } = await import('child_process')
    const http = await import('http')
    const fs = await import('fs')
    const path = await import('path')
    const os = await import('os')
    const { v4: uuidv4 } = await import('uuid')
    
    const audioDir = path.join(os.tmpdir(), 'spanish-tts-audio')
    
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true })
    }
    
    const MIME_TYPES = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav'
    }
    
    const serverInstance = http.createServer((req: any, res: any) => {
      if (req.method === 'POST' && req.url === '/synthesize') {
        let body = ''
        req.on('data', (chunk: any) => { body += chunk })
        req.on('end', () => {
          try {
            const { text, voice = 'es-ES-AlvaroNeural', rate = '-20%' } = JSON.parse(body)
            
            if (!text) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Text is required' }))
              return
            }
            
            const { spawn } = require('child_process')
            const filename = `tts_${uuidv4()}.mp3`
            const filepath = path.join(audioDir, filename)
            
            const command = process.platform === 'win32' ? 'edge-tts.cmd' : 'edge-tts'
            const args = ['--text', text, '--voice', voice, '--rate', rate, '--write-media', filepath]
            
            console.log('🎤 正在生成发音...')
            
            const ttsProcess = spawn(command, args)
            
            ttsProcess.on('error', (err: Error) => {
              console.error('Edge TTS error:', err.message)
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ 
                error: 'Edge TTS not installed',
                hint: 'Please install: pip install edge-tts'
              }))
            })
            
            ttsProcess.on('close', (code: number) => {
              if (code === 0 && fs.existsSync(filepath)) {
                res.writeHead(200, { 
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                })
                res.end(JSON.stringify({ 
                  success: true,
                  filename,
                  path: `/audio/${filename}`
                }))
              } else {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'TTS synthesis failed' }))
              }
            })
            
          } catch (error) {
            console.error('Server error:', error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Server error' }))
          }
        })
        
      } else if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify({ status: 'ok' }))
        
      } else if (req.method === 'GET' && req.url === '/voices') {
        const voices = [
          { id: 'es-ES-AlvaroNeural', name: 'Álvaro (西班牙男声)', recommended: true },
          { id: 'es-ES-ElviraNeural', name: 'Elvira (西班牙女声)' },
          { id: 'es-MX-DaliaNeural', name: 'Dalia (墨西哥女声)' },
          { id: 'es-MX-JorgeNeural', name: 'Jorge (墨西哥男声)' },
          { id: 'es-AR-TomasNeural', name: 'Tomás (阿根廷男声)' },
          { id: 'es-AR-FatimaNeural', name: 'Fatima (阿根廷女声)' },
          { id: 'es-CO-GonzaloNeural', name: 'Gonzalo (哥伦比亚)' },
          { id: 'es-CL-CamilaNeural', name: 'Camila (智利女声)' },
          { id: 'es-PE-CamilaNeural', name: 'Camila (秘鲁女声)' }
        ]
        
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        })
        res.end(JSON.stringify({ 
          success: true, 
          voices,
          default: 'es-ES-AlvaroNeural',
          defaultRate: '-20%'
        }))
        
      } else if (req.method === 'GET' && req.url.startsWith('/audio/')) {
        const filename = path.basename(req.url)
        const filepath = path.join(audioDir, filename)
        
        if (fs.existsSync(filepath)) {
          const ext = path.extname(filename) as keyof typeof MIME_TYPES
          const contentType = MIME_TYPES[ext] || 'audio/mpeg'
          res.writeHead(200, { 'Content-Type': contentType })
          fs.createReadStream(filepath).pipe(res)
        } else {
          res.writeHead(404)
          res.end('Audio not found')
        }
        
      } else {
        res.writeHead(404)
        res.end('Use POST /synthesize or GET /voices')
      }
    })
    
    serverInstance.listen(TTS_SERVER_PORT, () => {
      console.log('🎤 发音服务已启动: http://localhost:3003')
      console.log('✅ 支持9种西班牙语方言')
      console.log('🎯 默认: es-ES-AlvaroNeural, 语速-20%')
      isRunning = true
    })
    
    server = serverInstance
    return true
    
  } catch (error) {
    console.error('❌ TTS服务启动失败:', error)
    return false
  }
}

export const stopTTSService = () => {
  if (server) {
    server.close()
    server = null
    isRunning = false
    console.log('🛑 TTS服务已停止')
  }
}

export const getTTSUrl = () => `http://localhost:${TTS_SERVER_PORT}`
