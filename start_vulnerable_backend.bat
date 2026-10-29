@echo off
title NovaSoft Vulnerable Backend [Port 5001]
color 0E
cd /d "%~dp0vulnerable-site\backend"
echo ================================================================
echo        NOVASOFT VULNERABLE BACKEND SERVER (PORT 5001)
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
