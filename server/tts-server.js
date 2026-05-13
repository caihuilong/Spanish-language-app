const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const audioDir = path.join(__dirname, 'audios');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'es-ES-AlvaroNeural', speed = 0 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const filename = `${uuidv4()}.mp3`;
    const filepath = path.join(audioDir, filename);

    const speedParam = speed === 0 ? '' : ` --rate ${speed < 0 ? `${speed}%` : `+${speed}%`}`;
    
    const command = `edge-tts --text "${text}" --voice ${voice}${speedParam} --write-media ${filepath}`;

    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        console.error('TTS Error:', error);
        return res.status(500).json({ error: 'TTS generation failed', details: stderr || error.message });
      }

      if (fs.existsSync(filepath)) {
        res.json({
          success: true,
          audioUrl: `/audios/${filename}`,
          filename: filename,
          voice: voice
        });
      } else {
        res.status(500).json({ error: 'Audio file not created' });
      }
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/audios/:filename', (req, res) => {
  const filepath = path.join(audioDir, req.params.filename);
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).json({ error: 'Audio not found' });
  }
});

app.get('/api/voices', (req, res) => {
  const spanishVoices = [
    { id: 'es-ES-AlvaroNeural', name: 'Álvaro (西班牙)', gender: 'Male', quality: 'Neural' },
    { id: 'es-ES-ElviraNeural', name: 'Elvira (西班牙)', gender: 'Female', quality: 'Neural' },
    { id: 'es-MX-DaliaNeural', name: 'Dalia (墨西哥)', gender: 'Female', quality: 'Neural' },
    { id: 'es-MX-JorgeNeural', name: 'Jorge (墨西哥)', gender: 'Male', quality: 'Neural' },
    { id: 'es-AR-TomasNeural', name: 'Tomás (阿根廷)', gender: 'Male', quality: 'Neural' },
    { id: 'es-AR-FatimaNeural', name: 'Fatima (阿根廷)', gender: 'Female', quality: 'Neural' },
    { id: 'es-CO-GonzaloNeural', name: 'Gonzalo (哥伦比亚)', gender: 'Male', quality: 'Neural' },
    { id: 'es-CL-CatalinaNeural', name: 'Catalina (智利)', gender: 'Female', quality: 'Neural' },
    { id: 'es-PE-CamilaNeural', name: 'Camila (秘鲁)', gender: 'Female', quality: 'Neural' }
  ];

  res.json({
    success: true,
    voices: spanishVoices
  });
});

app.delete('/api/cleanup', (req, res) => {
  try {
    const files = fs.readdirSync(audioDir);
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    files.forEach(file => {
      const filepath = path.join(audioDir, file);
      const stats = fs.statSync(filepath);
      if (stats.mtimeMs < oneHourAgo) {
        fs.unlinkSync(filepath);
      }
    });

    res.json({ success: true, message: 'Cleanup completed' });
  } catch (error) {
    res.status(500).json({ error: 'Cleanup failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 TTS Server running on http://localhost:${PORT}`);
  console.log(`📡 Available voices: http://localhost:${PORT}/api/voices`);
  console.log(`🎯 Spanish Neural Voices ready!`);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
