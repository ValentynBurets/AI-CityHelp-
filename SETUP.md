# AI CityHelp - Setup Instructions

This document provides step-by-step instructions to set up and run the AI CityHelp PoC project.

## Prerequisites

- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **OpenAI API Key** - Get from [OpenAI](https://platform.openai.com/api-keys) or use Azure OpenAI

## Project Structure

```
AI-CityHelp-/
├── backend/              # .NET 8 Web API
│   └── AI-CityHelp.API/
├── frontend/             # React + TypeScript
└── README.md            # Technical specification
```

## Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend/AI-CityHelp.API
```

2. **Configure OpenAI API Key:**

The API key must be set as an environment variable. Use one of the following methods:

**Option A: Use the provided script (Windows PowerShell):**
```powershell
.\set-env-vars.ps1
```

**Option B: Use the provided batch file (Windows CMD):**
```cmd
set-env-vars.bat
```

**Option C: Set manually:**

Windows PowerShell:
```powershell
$env:OpenAI__ApiKey="YOUR_OPENAI_API_KEY_HERE"
```

Windows CMD:
```cmd
set OpenAI__ApiKey=YOUR_OPENAI_API_KEY_HERE
```

Linux/Mac:
```bash
export OpenAI__ApiKey=YOUR_OPENAI_API_KEY_HERE
```

**To set permanently (Windows):**
```powershell
[System.Environment]::SetEnvironmentVariable("OpenAI__ApiKey", "YOUR_OPENAI_API_KEY_HERE", "User")
```

**Note:** The API key is stored as an environment variable for security. It is NOT stored in `appsettings.json`.

3. **Restore packages:**
```bash
dotnet restore
```

4. **Run the backend:**
```bash
dotnet run
```

The API will start on `http://localhost:5000`

## Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Initial Setup Steps

1. **Start the backend** (see Backend Setup above)

2. **Start the frontend** (see Frontend Setup above)

3. **Load the Knowledge Base:**
   - Open the frontend in your browser
   - Navigate to "Knowledge Base" page
   - Click "Reload KB" button
   - Wait for the embeddings to be generated (this may take 30-60 seconds)

4. **Test Classification:**
   - Navigate to "Classification" page
   - Enter a test request (e.g., "Пошкоджений люк біля будинку")
   - Click "Classify"
   - View the results

## API Documentation

Once the backend is running, Swagger UI is available at:
`http://localhost:5000/swagger`

## Troubleshooting

### Backend Issues

- **"OpenAI:ApiKey is not configured"**: Make sure you've set the API key as an environment variable using `OpenAI__ApiKey` (double underscore). Run `set-env-vars.ps1` or set it manually.
- **Port already in use**: Change the port in `Properties/launchSettings.json`
- **Vector store errors**: Delete `data/embeddings.db` and reload the KB

### Frontend Issues

- **Cannot connect to API**: Ensure backend is running on port 5000
- **CORS errors**: Check that backend CORS is configured correctly in `Program.cs`

## Testing

### Sample Test Cases

1. "Пошкоджений люк біля будинку" → Should classify as "Дорожнє господарство"
2. "Не вивозять сміття вже тиждень" → Should classify as "Вивіз сміття"
3. "Відсутня вода в квартирі" → Should classify as "Водопостачання"
4. "Не працює опалення" → Should classify as "Опалення"

## Production Build

### Backend
```bash
cd backend/AI-CityHelp.API
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`


