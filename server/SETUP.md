# Edge TTS 服务器设置指南

## 快速开始

### 1. 安装依赖

```bash
cd spanish-learning-app/server
npm init -y
npm install express cors uuid
pip install edge-tts
```

### 2. 启动服务器

```bash
node tts-server.js
```

服务器将在 http://localhost:3002 运行

### 3. 测试发音

访问: http://localhost:3002/api/voices
- 查看可用的西班牙语语音

### 4. 前端配置

在前端代码中调用:

```javascript
const playSpanish = async (text) => {
  const response = await fetch('http://localhost:3002/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text,
      voice: 'es-ES-AlvaroNeural',
      speed: '-20%'
    })
  });
  
  const data = await response.json();
  return `http://localhost:3002${data.audioUrl}`;
};
```

## 推荐语音

### 西班牙 (卡斯蒂利亚)
- `es-ES-AlvaroNeural` - 男声，清晰标准
- `es-ES-ElviraNeural` - 女声，柔和自然

### 墨西哥
- `es-MX-DaliaNeural` - 女声，拉美发音
- `es-MX-JorgeNeural` - 男声

### 阿根廷
- `es-AR-TomasNeural` - 男声
- `es-AR-FatimaNeural` - 女声

## 语速设置

```javascript
speed: '-30%'  // 慢30% （推荐初学者）
speed: '-20%'  // 慢20%
speed: '-10%'  // 慢10%
speed: '0%'    // 正常速度
```

## Windows 用户

确保已安装 Python 和 pip:
```bash
pip install edge-tts
```

## 问题排查

### edge-tts 未找到
```bash
# 使用完整路径
python -m edge_tts --text "Hola" --voice es-ES-AlvaroNeural
```

### 端口占用
```bash
# 修改 tts-server.js 中的 PORT 为 3003
# 或杀掉占用进程
netstat -ano | findstr :3002
taskkill /PID <PID_NUMBER> /F
```

## 语音质量

Edge TTS 的优势：
- ✅ Neural Voices 神经网络语音
- ✅ 专为语言学习优化
- ✅ 清晰自然的发音
- ✅ 多种方言选择
- ✅ 语速控制精确

对比 Web Speech API：
- 质量提升：⭐⭐⭐⭐⭐
- 清晰度：大幅改善
- 西班牙语支持：⭐⭐⭐⭐⭐
