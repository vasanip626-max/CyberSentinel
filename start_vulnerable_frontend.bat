@echo off
title NovaSoft Vulnerable Frontend [Port 3002]
color 0D
cd /d "%~dp0vulnerable-site\frontend"
echo ================================================================
echo        NOVASOFT VULNERABLE SITE FRONTEND (PORT 3002)
echo ================================================================
echo.
set PORT=3002
echo [OK] Running npm start on http://localhost:3002...
npm start
echo.
echo [!] Frontend stopped.
pause
