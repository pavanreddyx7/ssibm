@echo off
echo Stopping any existing processes on ports 3000, 5001 and 5173...

for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000 "') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5001 "') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5173 "') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo Starting all services...

start "Frontend - Vite" cmd /k "cd /d %~dp0ssibm-website && npm run dev"
start "Backend - Express Server" cmd /k "cd /d %~dp0ssibm-website && npm run dev:server"
start "Firebase - Functions Emulator" cmd /k "cd /d %~dp0 && firebase emulators:start --only functions"

echo.
echo Frontend  : http://localhost:5173
echo Backend   : http://localhost:3000
echo Emulator  : http://127.0.0.1:5001
echo.
