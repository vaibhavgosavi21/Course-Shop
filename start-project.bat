@echo off
echo ========================================
echo    Course Platform - Quick Start
echo ========================================
echo.

echo 🔄 Testing setup...
cd backend
node testSetup.js
if errorlevel 1 (
    echo.
    echo ❌ Setup test failed. Please check the errors above.
    echo.
    echo 💡 Try running: node createAdmin.js
    pause
    exit /b 1
)

echo.
echo 🚀 Starting servers...
echo.

echo 📡 Starting Backend Server (Port 5001)...
start "Backend Server" cmd /k "npm run dev"

timeout /t 3 /nobreak > nul

echo 🌐 Starting Frontend Server (Port 3000)...
cd ..
cd frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo ✅ Both servers are starting...
echo.
echo 🌍 URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5001
echo.
echo 👤 Admin Login:
echo   Email:    admin2020@gmail.com
echo   Password: Admin@123
echo.
echo Press any key to exit...
pause > nul