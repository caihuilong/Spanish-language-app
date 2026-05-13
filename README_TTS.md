# 🎤 西班牙语发音服务

## 快速开始（5分钟）

### 1️⃣ 安装Python（如果没有）
- 下载地址：https://www.python.org/downloads/
- Windows用户：安装时**勾选** "Add Python to PATH"

### 2️⃣ 安装Edge TTS
打开命令行（Windows按 `Win + R` 输入 `cmd`）：

```bash
# 复制粘贴这行命令
pip install edge-tts
```

看到 "Successfully installed edge-tts" 就成功了！

### 3️⃣ 启动发音服务
```bash
cd spanish-learning-app/server
npm install
node simple-tts-server.js
```

### 4️⃣ 验证成功
浏览器打开 http://localhost:3003/voices
看到语音列表就成功了！

## 📖 使用方法

启动服务后，应用会自动使用高质量发音！

- ✅ 点击词汇 → 听发音
- ✅ 点击句子 → 听朗读  
- ✅ 点击全文朗读 → 听整篇

## 🔧 如果遇到问题

### 问题1：pip不是命令
```bash
# Windows尝试
python -m pip install edge-tts

# Mac尝试
python3 -m pip install edge-tts
```

### 问题2：端口被占用
修改 `server/simple-tts-server.js` 第7行：
```javascript
const PORT = 3003;  // 改成 3004 或其他端口
```

### 问题3：Node.js找不到
下载地址：https://nodejs.org/

## 🎯 推荐设置

在应用中：
- 语音：**es-ES-AlvaroNeural**（西班牙男声，最清晰）
- 语速：**-30%**（最慢，适合初学者）

## 🌐 离线使用

Edge TTS需要网络连接。
如果离线，请使用应用内的音标和音节划分功能学习发音规则。

## 📱 其他发音方案

### 免费在线发音
- Forvo.com（真人发音）
- TTSMaker.cn（免费在线TTS）

### 专业API（需付费）
- Azure Cognitive Services
- ElevenLabs
- Google Cloud TTS

详见：TTS_ALTERNATIVES.md

## 💡 提示

Edge TTS服务需要保持运行。
可以最小化命令行窗口，不影响使用。
