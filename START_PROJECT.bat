@echo off
echo ========================================
echo Starting Course Shop Platform
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is installed: 
node --version
echo.

echo [2/4] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 >nul
cd ..
echo Backend server started on http://localhost:5001
echo.

echo [3/4] Starting Frontend Server...
cd frontend
start "Frontend Server" cmd /k "npm start"
cd ..
echo Frontend server starting on http://localhost:3001
echo.

echo [4/4] All servers started!
echo ========================================
echo Backend:  http://localhost:5001/api/health
echo Frontend: http://localhost:3001
echo ========================================
echo.
echo Press any key to open the application...
pause >nul
start http://localhost:3001
