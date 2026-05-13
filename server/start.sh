#!/bin/bash

echo "========================================"
echo "安装依赖..."
npm install

echo ""
echo "检查Edge TTS..."
python3 -c "import edge_tts" 2>/dev/null && echo "✅ Edge TTS已安装" || {
    echo "⚠️  安装Edge TTS中..."
    pip3 install edge-tts
}

echo ""
echo "========================================"
echo "🎤 启动发音服务..."
echo "========================================"
echo ""

node server.js
