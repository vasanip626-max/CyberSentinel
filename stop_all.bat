@echo off
chcp 65001 >nul
title CyberSentinel - Stop All Services
color 0C

echo ================================================================
echo           STOPPING ALL CYBERSENTINEL & NOVASOFT SERVICES
echo ================================================================
echo.

echo [1/4] Freeing Port 5000 (CyberSentinel Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/4] Freeing Port 5001 (NovaSoft Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [3/4] Freeing Port 3001 (CyberSentinel Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [4/4] Freeing Port 3002 (NovaSoft Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3002" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ================================================================
echo [✓] All background processes on ports 5000, 5001, 3001, 3002 stopped!
echo ================================================================
echo.
pause
