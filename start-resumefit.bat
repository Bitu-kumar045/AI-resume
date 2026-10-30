@echo off
echo ====================================================
echo Starting ResumeFit Frontend Server...
echo ====================================================
cd /d "%~dp0frontend"
start http://localhost:5173
call npm run dev
pause
