@echo off
echo Starting Umair Khan Portfolio...
cd /d "%~dp0"
start cmd /c "npm run dev"
timeout /t 2 /nobreak > nul
start http://localhost:5173/
