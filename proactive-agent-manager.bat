@echo off
chcp 65001 >nul
echo.
echo ============================================================
echo   Proactive Squad Agent Manager
echo ============================================================
echo.
echo This system manages your squad agents proactively:
echo   - Auto-spawns agents when tasks are assigned
echo   - Monitors progress automatically
echo   - Reports status every 5 minutes
echo   - Alerts when tasks complete
echo.
echo Press Ctrl+C to stop at any time.
echo.
echo ============================================================
echo   Starting systems...
echo ============================================================
echo.

:: Start Auto-Agent Spawner in background
start "" /MIN cmd /c "node auto-spawn-agents.js"

:: Wait 3 seconds for spawner to start
timeout /t 3 /nobreak

:: Start Task Monitor in foreground
echo.
echo.
echo ============================================================
echo   Task Monitor Active - Proactive Updates
echo ============================================================
echo.
node task-monitor.js

:: This script never exits unless Ctrl+C
:: Both processes will continue running
