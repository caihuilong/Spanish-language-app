@echo off
echo.
echo ========================================
echo    Edge TTS 安装脚本 (Windows)
echo ========================================
echo.

echo [1/3] 检查 Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 未安装
    echo 请先安装 Python: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python 已安装

echo.
echo [2/3] 安装 edge-tts...
pip install edge-tts -q

if errorlevel 1 (
    echo ❌ 安装失败，尝试:
    echo   pip install edge-tts --user
    echo   或者使用管理员权限运行
    pause
    exit /b 1
)

echo ✅ edge-tts 安装成功

echo.
echo [3/3] 测试安装...
edge-tts --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  可能需要重启命令行
)

echo.
echo ========================================
echo ✅ 安装完成！
echo ========================================
echo.
echo 下一步:
echo 1. 运行: node simple-tts-server.js
echo 2. 或: node tts-server.js
echo.
echo 推荐语音:
echo   - es-ES-AlvaroNeural (西班牙男声)
echo   - es-MX-DaliaNeural (墨西哥女声)
echo   - es-AR-TomasNeural (阿根廷男声)
echo.
echo 语速设置:
echo   -20%% (慢20%%) - 推荐初学者
echo   -30%% (慢30%%) (更慢)
echo   -10%% (慢10%%) (稍快)
echo.
pause
