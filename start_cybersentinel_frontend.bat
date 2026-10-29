@echo off
title CyberSentinel SOC Frontend [Port 3001]
color 0B
cd /d "%~dp0frontend"
echo ================================================================
echo       CYBERSENTINEL SOC DASHBOARD FRONTEND (PORT 3001)
echo ================================================================
echo.
set PORT=3001
echo [OK] Running npm start on http://localhost:3001...
npm start
echo.
echo [!] Frontend stopped.
pause
