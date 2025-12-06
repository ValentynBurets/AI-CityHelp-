# Environment Variable Setup

## Quick Start

The OpenAI API key is configured via environment variables for security.

### Windows PowerShell

Run the provided script:
```powershell
.\set-env-vars.ps1
```

Or set manually:
```powershell
$env:OpenAI__ApiKey="YOUR_OPENAI_API_KEY_HERE"
```

### Windows CMD

Run the provided batch file (it will prompt you for the key):
```cmd
set-env-vars.bat
```

Or set manually:
```cmd
set OpenAI__ApiKey=YOUR_OPENAI_API_KEY_HERE
```

### Set Permanently (Windows)

To set the environment variable permanently (survives terminal restarts):

**PowerShell (as Administrator):**
```powershell
[System.Environment]::SetEnvironmentVariable("OpenAI__ApiKey", "YOUR_OPENAI_API_KEY_HERE", "User")
```

**CMD:**
```cmd
setx OpenAI__ApiKey "YOUR_OPENAI_API_KEY_HERE"
```

**Note:** After setting permanently, you may need to restart your terminal or IDE.

### Linux/Mac

```bash
export OpenAI__ApiKey=YOUR_OPENAI_API_KEY_HERE
```

To set permanently, add to `~/.bashrc` or `~/.zshrc`:
```bash
echo 'export OpenAI__ApiKey=YOUR_OPENAI_API_KEY_HERE' >> ~/.bashrc
source ~/.bashrc
```

### Using .env File (Recommended)

Create a `.env` file in the `AI-CityHelp.API` directory:
```
OpenAI__ApiKey=YOUR_OPENAI_API_KEY_HERE
```

**Note:** The `.env` file is already in `.gitignore` and will not be committed to the repository.

## Verify

After setting the environment variable, verify it's set correctly:

**Windows PowerShell:**
```powershell
$env:OpenAI__ApiKey
```

**Windows CMD:**
```cmd
echo %OpenAI__ApiKey%
```

**Linux/Mac:**
```bash
echo $OpenAI__ApiKey
```

## Important Notes

- The environment variable name uses **double underscore** (`__`) which maps to `OpenAI:ApiKey` in .NET configuration
- The API key is **NOT** stored in `appsettings.json` for security
- Environment variables set in the current terminal session only last for that session
- To persist across sessions, use the "Set Permanently" methods above

