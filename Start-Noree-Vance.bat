@echo off
title Noree Vance — Gentle Framework English Studio
cd /d "%~dp0"

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    if exist "node_modules" (
        echo Starting Noree Vance Next.js Full-Stack Server...
        npm run dev
        goto :eof
    )
)

echo Launching Noree Vance Instant Standalone Studio on http://localhost:3080 ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
