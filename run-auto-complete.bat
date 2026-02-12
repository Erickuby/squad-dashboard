@echo off
chcp 65001 >nul
echo.
echo ============================================================
echo   Start Auto-Complete Runner
echo ============================================================
echo.
echo This will auto-complete tasks every 5 minutes.
echo Tasks in "In Progress" for 20+ min without activity
echo will be moved to "Waiting Approval".
echo.
echo Press Ctrl+C to stop.
echo.

cd squad-dashboard

echo Starting auto-complete runner...
echo.

node scripts/run-auto-complete.js

pause
