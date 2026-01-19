@echo off
echo ========================================
echo Course Shop - System Check
echo ========================================
echo.

echo [1/6] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js NOT installed
    echo Please install from: https://nodejs.org/
) else (
    echo ✅ Node.js installed: 
    node --version
)
echo.

echo [2/6] Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm NOT installed
) else (
    echo ✅ npm installed: 
    npm --version
)
echo.

echo [3/6] Checking Backend Dependencies...
cd backend
if exist node_modules (
    echo ✅ Backend dependencies installed
) else (
    echo ❌ Backend dependencies NOT installed
    echo Run: cd backend ^&^& npm install
)
cd ..
echo.

echo [4/6] Checking Frontend Dependencies...
cd frontend
if exist node_modules (
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ Frontend dependencies NOT installed
    echo Run: cd frontend ^&^& npm install
)
cd ..
echo.

echo [5/6] Checking Environment Files...
if exist backend\.env (
    echo ✅ Backend .env exists
) else (
    echo ❌ Backend .env NOT found
    echo Create backend\.env file
)

if exist frontend\.env (
    echo ✅ Frontend .env exists
) else (
    echo ❌ Frontend .env NOT found
    echo Create frontend\.env file
)
echo.

echo [6/6] Checking Ports...
netstat -ano | findstr :5001 >nul 2>&1
if errorlevel 1 (
    echo ✅ Port 5001 available
) else (
    echo ⚠️  Port 5001 in use
)

netstat -ano | findstr :3001 >nul 2>&1
if errorlevel 1 (
    echo ✅ Port 3001 available
) else (
    echo ⚠️  Port 3001 in use
)
echo.

echo ========================================
echo System Check Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. If dependencies missing: npm install in backend and frontend
echo 2. If .env missing: Create .env files with required variables
echo 3. Start project: Run START_PROJECT.bat
echo.
pause
