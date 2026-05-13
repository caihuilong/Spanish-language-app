#!/bin/bash

echo "========================================="
echo "  🎤 西班牙语发音学习应用启动中..."
echo "========================================="
echo ""

echo "📦 安装Node依赖..."
npm install

echo ""
echo "🔧 安装发音服务依赖..."
cd server && npm install && cd ..

echo ""
echo "检查Python和Edge TTS..."
python3 --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Python已安装"
    python3 -c "import edge_tts" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Edge TTS已安装"
    else
        echo "📥 安装Edge TTS..."
        pip3 install edge-tts
    fi
else
    echo "⚠️  请先安装Python: https://www.python.org/downloads/"
fi

echo ""
echo "🚀 启动应用和发音服务..."
echo "========================================="
echo ""

npm run dev &

cd server && node server.js &

wait
