@echo off
chcp 65001 >nul
set SCRIPT_DIR=%~dp0
echo.
echo ============================================================
echo   Start Auto-Complete Runner
echo ============================================================
echo.
echo Script directory: %SCRIPT_DIR%
echo.
echo This will check tasks every 5 minutes.
echo Tasks inactive for 20+ min will auto-complete.
echo Press Ctrl+C to stop.
echo.

echo Starting auto-complete runner...
echo.

node "%SCRIPT_DIR%\scripts\run-auto-complete.js"

echo.
echo ============================================================
echo   Runner Stopped
echo ============================================================
pause
