@echo off
chcp 65001 >nul
echo.
echo ============================================================
echo   Starting Squad Bot Polling System
echo ============================================================
echo   Polling every 2 minutes...
echo   Press Ctrl+C to stop.
echo.

:poll
echo.
echo %time%
echo -------------------------------------------------------------

npm run bot-poll

if %errorlevel% neq 0 (
    echo.
    echo   Poll failed with error code: %errorlevel%
)

timeout /t 120 /nobreak
goto poll
