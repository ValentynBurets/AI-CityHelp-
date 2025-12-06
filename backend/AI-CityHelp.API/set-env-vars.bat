@echo off
REM Batch script to set OpenAI API key as environment variable
REM Run this script before starting the application
REM This script will prompt you for your API key to avoid committing it to the repository

echo.
echo OpenAI API Key Setup
echo ====================
echo.

REM Check if .env file exists
if exist .env (
    echo Found .env file. Reading API key from .env...
    for /f "tokens=2 delims==" %%a in ('findstr /b "OpenAI__ApiKey=" .env') do (
        set "apiKey=%%a"
    )
    if defined apiKey (
        if not "%apiKey%"=="YOUR_OPENAI_API_KEY_HERE" (
            echo API key loaded from .env file.
            goto :setKey
        )
    )
    echo OpenAI__ApiKey not found or not set in .env file.
    goto :prompt
) else (
    goto :prompt
)

:prompt
echo No .env file found. Please enter your OpenAI API key:
echo (The key will be set for this session only)
set /p apiKey="Enter API key: "
if "%apiKey%"=="" (
    echo Error: API key cannot be empty.
    exit /b 1
)

:setKey
set OpenAI__ApiKey=%apiKey%

echo.
echo OpenAI API key has been set for the current command prompt session.
echo.
echo To set it permanently, run:
echo setx OpenAI__ApiKey "YOUR_API_KEY"
echo.
echo Or create a .env file with:
echo OpenAI__ApiKey=YOUR_API_KEY
echo.
echo Note: You may need to restart your terminal after setting it permanently.
echo.
