@echo off
chcp 65001 >nul
color 0A
echo.
echo =========================================
echo.
echo    西班牙语发音学习应用启动中...
echo.
echo =========================================
echo.

echo [1/3] 安装Node依赖...
call npm install
if errorlevel 1 (
    echo ❌ npm install 失败
    pause
    exit /b 1
)
echo ✅ Node依赖安装完成

echo.
echo [2/3] 安装发音服务...
cd server
call npm install
if errorlevel 1 (
    echo ⚠️ 服务器依赖安装失败
)
cd ..

echo.
echo [3/3] 检查Python和Edge TTS...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python未安装
    echo 请先安装 Python: https://www.python.org/downloads/
    goto :start_anyway
)

python -c "import edge_tts" >nul 2>&1
if errorlevel 1 (
    echo 📥 安装Edge TTS...
    pip install edge-tts -q
    if errorlevel 1 (
        echo ⚠️ Edge TTS安装失败，请手动运行: pip install edge-tts
    ) else (
        echo ✅ Edge TTS安装成功
    )
) else (
    echo ✅ Python和Edge TTS已就绪
)

:start_anyway
echo.
echo =========================================
echo.
echo 🚀 启动应用和发音服务...
echo =========================================
echo.

start "发音服务" cmd /k "cd server ^&^& node server.js"

timeout /t 2 >nul
npm run dev

pause
