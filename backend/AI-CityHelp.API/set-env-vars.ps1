# PowerShell script to set OpenAI API key as environment variable
# Run this script before starting the application
# This script will prompt you for your API key to avoid committing it to the repository

Write-Host "OpenAI API Key Setup" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "Found .env file. Reading API key from .env..." -ForegroundColor Yellow
    $envContent = Get-Content $envFile | Where-Object { $_ -match "^OpenAI__ApiKey=" }
    if ($envContent) {
        $apiKey = ($envContent -split "=")[1].Trim()
        if ($apiKey -and $apiKey -ne "YOUR_OPENAI_API_KEY_HERE") {
            Write-Host "API key loaded from .env file." -ForegroundColor Green
        } else {
            Write-Host "API key not set in .env file. Please set it manually." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "OpenAI__ApiKey not found in .env file." -ForegroundColor Red
        exit 1
    }
} else {
    # Prompt for API key
    Write-Host "No .env file found. Please enter your OpenAI API key:" -ForegroundColor Yellow
    Write-Host "(The key will be set for this session only)" -ForegroundColor Gray
    $apiKey = Read-Host -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
    $apiKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

# Set for current session
$env:OpenAI__ApiKey = $apiKey

Write-Host ""
Write-Host "OpenAI API key has been set for the current PowerShell session." -ForegroundColor Green
Write-Host ""
Write-Host "To set it permanently, run:" -ForegroundColor Yellow
Write-Host '[System.Environment]::SetEnvironmentVariable("OpenAI__ApiKey", "YOUR_API_KEY", "User")' -ForegroundColor Cyan
Write-Host ""
Write-Host "Or create a .env file with:" -ForegroundColor Yellow
Write-Host "OpenAI__ApiKey=YOUR_API_KEY" -ForegroundColor Cyan
