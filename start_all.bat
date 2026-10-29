@echo off
cd /d "%~dp0"
title CyberSentinel - Master Launcher
color 0B

echo ================================================================
echo           CYBERSENTINEL & NOVASOFT SYSTEM LAUNCHER
echo ================================================================
echo.

:: 1. Start CyberSentinel Backend (Port 5000)
echo [1/4] Launching CyberSentinel Flask Backend (Port 5000)...
start "CyberSentinel Backend [5000]" cmd /c "%~dp0start_cybersentinel_backend.bat"
timeout /t 2 /nobreak >nul

:: 2. Start NovaSoft Vulnerable Backend (Port 5001)
echo [2/4] Launching NovaSoft Vulnerable Backend (Port 5001)...
start "NovaSoft Backend [5001]" cmd /c "%~dp0start_vulnerable_backend.bat"
timeout /t 2 /nobreak >nul

:: 3. Start CyberSentinel SOC Frontend (Port 3001)
echo [3/4] Launching CyberSentinel SOC Dashboard (Port 3001)...
start "CyberSentinel Frontend [3001]" cmd /c "%~dp0start_cybersentinel_frontend.bat"
timeout /t 2 /nobreak >nul

:: 4. Start NovaSoft Vulnerable Frontend (Port 3002)
echo [4/4] Launching NovaSoft Vulnerable Frontend (Port 3002)...
start "NovaSoft Frontend [3002]" cmd /c "%~dp0start_vulnerable_frontend.bat"

echo.
echo ================================================================
echo [✓] All 4 systems launched in 4 separate terminal windows!
echo ================================================================
echo  - CyberSentinel SOC Dashboard: http://localhost:3001
echo  - CyberSentinel Backend API:   http://127.0.0.1:5000
echo  - NovaSoft Vulnerable Site:   http://localhost:3002
echo  - NovaSoft Vulnerable Backend: http://127.0.0.1:5001
echo ================================================================
echo.
timeout /t 5
