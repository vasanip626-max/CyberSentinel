@echo off
title CyberSentinel Flask Backend [Port 5000]
color 0A
cd /d "%~dp0backend"
echo ================================================================
echo       CYBERSENTINEL FLASK BACKEND SERVER (PORT 5000)
echo ================================================================
echo.
if exist venv\Scripts\activate.bat (
    echo [OK] Activating Python Virtual Environment...
    call venv\Scripts\activate.bat
)
echo [OK] Running python app.py...
python app.py
echo.
echo [!] Server stopped.
pause
