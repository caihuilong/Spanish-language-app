const { exec, spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const PORT = 3003;
const audioDir = path.join(os.tmpdir(), 'spanish-tts');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const MIME_TYPES = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/synthesize') {
    let body = '';
    
    req.on('data', chunk => { body += chunk; });
    
    req.on('end', () => {
      try {
        const { text, voice = 'es-ES-AlvaroNeural', rate = '-20%' } = JSON.parse(body);
        
        if (!text) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Text is required' }));
          return;
        }

        const filename = `tts_${uuidv4()}.mp3`;
        const filepath = path.join(audioDir, filename);

        const command = process.platform === 'win32' ? 'edge-tts.cmd' : 'edge-tts';
        
        const args = [
          '--text', text,
          '--voice', voice,
          '--rate', rate,
          '--write-media', filepath
        ];

        console.log('🎤 Synthesizing:', text.substring(0, 50) + '...');
        console.log('🎯 Voice:', voice, 'Rate:', rate);

        const tts = spawn(command, args);

        tts.on('error', (err) => {
          console.error('❌ Edge TTS Error:', err.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Edge TTS not installed',
            hint: 'Run: pip install edge-tts'
          }));
        });

        tts.on('close', (code) => {
          if (code === 0 && fs.existsSync(filepath)) {
            console.log('✅ Audio created:', filename);
            res.writeHead(200, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ 
              success: true,
              filename: filename,
              path: `/audio/${filename}`
            }));
          } else {
            console.error('❌ TTS failed with code:', code);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'TTS synthesis failed' }));
          }
        });

      } catch (error) {
        console.error('❌ Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });

  } else if (req.method === 'GET' && req.url.startsWith('/audio/')) {
    const filename = path.basename(req.url);
    const filepath = path.join(audioDir, filename);
    
    if (fs.existsSync(filepath)) {
      const ext = path.extname(filename);
      res.writeHead(200, { 
        'Content-Type': MIME_TYPES[ext] || 'audio/mpeg',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filepath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Audio not found');
    }

  } else if (req.method === 'GET' && req.url === '/voices') {
    const voices = [
      { 
        id: 'es-ES-AlvaroNeural', 
        name: 'Álvaro (西班牙男声)', 
        region: 'Spain',
        recommended: true 
      },
      { 
        id: 'es-ES-ElviraNeural', 
        name: 'Elvira (西班牙女声)', 
        region: 'Spain',
        recommended: false 
      },
      { 
        id: 'es-MX-DaliaNeural', 
        name: 'Dalia (墨西哥女声)', 
        region: 'Mexico',
        recommended: false 
      },
      { 
        id: 'es-AR-TomasNeural', 
        name: 'Tomás (阿根廷男声)', 
        region: 'Argentina',
        recommended: false 
      },
      { 
        id: 'es-CO-GonzaloNeural', 
        name: 'Gonzalo (哥伦比亚)', 
        region: 'Colombia',
        recommended: false 
      }
    ];

    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ 
      success: true, 
      voices,
      default: 'es-ES-AlvaroNeural',
      defaultRate: '-20%'
    }));

  } else if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ 
      status: 'running',
      audioDir: audioDir
    }));

  } else {
    res.writeHead(404);
    res.end('Not Found. Use POST /synthesize or GET /voices');
  }
});

server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🎉 Edge TTS Simple Server Started!');
  console.log('='.repeat(50));
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🎤 Voices: http://localhost:${PORT}/voices`);
  console.log(`🎯 API: POST /synthesize`);
  console.log('='.repeat(50));
  console.log('');
  console.log('📝 Usage:');
  console.log('  curl -X POST http://localhost:3003/synthesize \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"text": "Hola, ¿cómo estás?", "voice": "es-ES-AlvaroNeural", "rate": "-20%"}\'');
  console.log('');
  console.log('⚠️  Make sure edge-tts is installed: pip install edge-tts');
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  fs.readdirSync(audioDir).forEach(file => {
    fs.unlinkSync(path.join(audioDir, file));
  });
  process.exit();
});
