@echo off
rem Starts the LEAD52 landing page at http://localhost:4173 and opens it.
cd /d "%~dp0"
where node >nul 2>nul || (
  echo Node.js is not installed. Get it from https://nodejs.org, then run this again.
  echo You can still view the page by opening public\index.html.
  pause
  exit /b 1
)
start "" http://localhost:4173
node server.mjs
pause
