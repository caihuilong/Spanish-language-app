# 🎤 Edge TTS 发音服务设置指南

## 快速安装（5分钟搞定）

### 第一步：安装Python（如果没有）

1. 访问 https://www.python.org/downloads/
2. 下载Python 3.8+
3. 安装时勾选 "Add Python to PATH"
4. 验证安装：打开命令行，输入 `python --version`

### 第二步：安装Edge TTS

打开命令行，运行：

```bash
# Windows
pip install edge-tts

# 或
python -m pip install edge-tts

# macOS
pip3 install edge-tts

# Linux
sudo apt install python3-pip
pip3 install edge-tts
```

验证安装成功：
```bash
edge-tts --version
```

### 第三步：启动TTS服务

```bash
cd spanish-learning-app/server
npm install
node simple-tts-server.js
```

看到下面的输出就成功了：
```
🎉 Edge TTS Simple Server Started!
📡 Server: http://localhost:3003
🎤 Voices: http://localhost:3003/voices
```

### 第四步：测试发音

在浏览器访问：
- http://localhost:3003/voices 查看可用语音
- http://localhost:3003/health 检查服务状态

## 🌟 推荐配置

### 最适合初学者的设置

```javascript
voice: 'es-ES-AlvaroNeural'  // 西班牙男声，清晰标准
rate: '-30%'               // 慢30%，最清晰
```

### 其他优质选择

| 语音 | 特点 | 推荐度 |
|------|------|--------|
| es-ES-AlvaroNeural | 西班牙男声，标准清晰 | ⭐⭐⭐⭐⭐ |
| es-ES-ElviraNeural | 西班牙女声，柔和 | ⭐⭐⭐⭐ |
| es-MX-DaliaNeural | 墨西哥女声 | ⭐⭐⭐⭐ |
| es-AR-TomasNeural | 阿根廷男声 | ⭐⭐⭐⭐ |

## 🔧 前端使用

应用已配置好，直接使用即可：

1. **词汇发音**：点击词汇听发音（自动使用Edge TTS）
2. **句子朗读**：点击句子听朗读
3. **全文朗读**：点击全文朗读按钮

## ❓ 常见问题

### Q: pip 不是内部命令？
```bash
# Windows
python -m pip install edge-tts

# 或者
py -m pip install edge-tts
```

### Q: edge-tts 安装失败？
```bash
# 使用管理员权限
pip install edge-tts --user

# 或更新pip
python -m pip install --upgrade pip
pip install edge-tts
```

### Q: node 命令找不到？
安装 Node.js: https://nodejs.org/

### Q: 端口被占用？
修改 `simple-tts-server.js` 中的 `PORT` 为其他端口（如 3004）

### Q: 想要停止服务？
按 `Ctrl + C` 在运行窗口中

## 📊 语音质量对比

| TTS服务 | 质量 | 免费 | 西班牙语 | 推荐 |
|---------|------|------|---------|------|
| Edge TTS | ⭐⭐⭐⭐⭐ | ✅ | ⭐⭐⭐⭐⭐ | ✅✅✅ |
| Web Speech API | ⭐⭐ | ✅ | ⭐⭐ | ❌ |
| Azure TTS | ⭐⭐⭐⭐⭐ | 部分 | ⭐⭐⭐⭐⭐ | 需付费 |

## 🎯 优势

✅ **质量高**：微软神经网络语音，比浏览器内置好很多
✅ **免费**：pip安装即可
✅ **多种方言**：西班牙、墨西哥、阿根廷等
✅ **语速可调**：支持精确的语速控制
✅ **专为语言学习优化**：清晰的元音和辅音

## 🚀 进阶使用

### 使用不同的语音
```javascript
// 在应用中找到TTS设置
setVoice('es-MX-DaliaNeural')  // 墨西哥女声
setRate('-30%')                 // 最慢速度
```

### 自定义语速
```javascript
'-10%'  // 慢10%
'-20%'  // 慢20%（推荐）
'-30%'  // 慢30%（最慢）
'0%'    // 正常速度
```

## 📝 快速测试命令

```bash
# Windows PowerShell
curl -X POST http://localhost:3003/synthesize `
  -H "Content-Type: application/json" `
  -d '{"text": "Hola, ¿cómo estás?", "voice": "es-ES-AlvaroNeural", "rate": "-20%"}'
```

## ✅ 验证安装成功

运行后检查：

1. ✅ Node服务器显示 "Server running"
2. ✅ 浏览器访问 http://localhost:3003/voices 显示语音列表
3. ✅ 应用中点击发音能听到声音

## 🎉 完成！

安装完成，享受高质量的西班牙语发音！
