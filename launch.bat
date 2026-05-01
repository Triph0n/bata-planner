@echo off
cd /d "%~dp0"
echo Starting Bata Planner...
start "Bata Planner Server" npm run dev
echo Waiting for server...
timeout /t 4 >nul
start http://localhost:5188
