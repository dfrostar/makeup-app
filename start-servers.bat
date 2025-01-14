@echo off
echo Starting Beauty Directory Servers...

:: Start PHP Server
start cmd /k "cd %~dp0 && php -S localhost:8000 -t public"

:: Start Next.js Frontend
start cmd /k "cd %~dp0/frontend && npm run dev"

echo Servers started!
echo Backend running on: http://localhost:8000
echo Frontend running on: http://localhost:3000
