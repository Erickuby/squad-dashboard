#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Start Bot Polling System Continuously

Wrapper script to run bot-poll in a loop.
Use this to keep squad agents processing tasks.

Usage: python scripts/start-bot.py
"""

import subprocess
import time
import signal
import sys
import os

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    os.system('chcp 65001 >nul 2>&1')

POLL_INTERVAL_SECONDS = 120  # 2 minutes

print("\n" + "=" * 60)
print("  Starting Squad Bot Polling System")
print("=" * 60)
print(f"  Polling every {POLL_INTERVAL_SECONDS} seconds...")
print("  Press Ctrl+C to stop.\n")

poll_count = 0

def run_poll():
    global poll_count
    poll_count += 1

    timestamp = time.strftime("%H:%M:%S")
    print(f"\n{'-' * 60}")
    print(f"  Poll #{poll_count} | {timestamp}")
    print('-' * 60)

    try:
        result = subprocess.run(
            ['npm', 'run', 'bot-poll'],
            capture_output=True,
            text=True,
            shell=True,
            encoding='utf-8',
            errors='ignore'
        )

        if result.returncode != 0:
            print(f"\n  Poll #{poll_count} failed with code {result.returncode}")
            if result.stderr:
                print(f"  Error: {result.stderr}")
    except Exception as e:
        print(f"\n  Error running poll: {e}")

def signal_handler(sig, frame):
    print(f"\n\nStopping bot polling system...")
    print(f"  Total polls completed: {poll_count}")
    print("  Goodbye!")
    print("\n" + "=" * 60)
    sys.exit(0)

# Register signal handlers
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# Run first poll immediately
run_poll()

# Set up interval for continuous polling
try:
    while True:
        time.sleep(POLL_INTERVAL_SECONDS)
        run_poll()
except KeyboardInterrupt:
    signal_handler(signal.SIGINT, None)
