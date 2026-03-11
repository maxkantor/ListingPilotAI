@echo off
REM ListingPilot AI - Quick Start (Windows)

set ROOT=%~dp0
set ROOT=%ROOT:~0,-1%

echo.
echo =====================================
echo  ListingPilot AI - Quick Start
echo =====================================
echo.

REM Check prerequisites
echo Checking prerequisites...

where dotnet >nul 2>nul
if errorlevel 1 (
    echo X .NET SDK not found. Install from https://dotnet.microsoft.com/download
    exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
    echo X Node.js not found. Install from https://nodejs.org
    exit /b 1
)

echo OK - .NET and Node.js detected
echo.

REM Start backend
echo Starting backend (port 5000)...
cd backend
echo Restoring packages...
call dotnet restore
cd ..

REM Open new terminal for backend
echo.
echo Opening new terminal window for backend...
start "ListingPilot Backend" cmd /k "cd /d ""%ROOT%\backend"" && dotnet run --project src/ListingPilot.Api"

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 5 /nobreak

REM Start frontend
echo.
echo Starting frontend (port 3000)...
cd /d "%ROOT%\frontend"

echo Installing npm packages...
call npm install

REM Open new terminal for frontend
echo.
echo Opening new terminal window for frontend...
start "ListingPilot Frontend" cmd /k "cd /d ""%ROOT%\frontend"" && npm run dev"

echo.
echo =====================================
echo ListingPilot AI is starting!
echo =====================================
echo.
echo Frontend:   http://localhost:3000
echo Backend:    http://localhost:5000
echo API Docs:   http://localhost:5000/swagger
echo.
echo Note: Frontend and backend are starting in separate windows.
echo.
echo Press any key to close this window...
pause >nul
