# AI CityHelp Backend

.NET 8 Web API with RAG engine for classifying municipal service requests.

## Prerequisites

- .NET 8 SDK
- OpenAI API key (or Azure OpenAI)

## Setup

1. **Configure OpenAI API Key as Environment Variable:**

The API key must be set as an environment variable (NOT in appsettings.json for security).

**Windows PowerShell:**
```powershell
$env:OpenAI__ApiKey="YOUR_OPENAI_API_KEY_HERE"
```

Or use the provided script (it will prompt you for the key):
```powershell
.\set-env-vars.ps1
```

**Windows CMD:**
```cmd
set OpenAI__ApiKey=YOUR_OPENAI_API_KEY_HERE
```

Or use the provided batch file (it will prompt you for the key):
```cmd
set-env-vars.bat
```

**Linux/Mac:**
```bash
export OpenAI__ApiKey=YOUR_OPENAI_API_KEY_HERE
```

**Using .env file (Recommended):**
Create a `.env` file in the `AI-CityHelp.API` directory:
```
OpenAI__ApiKey=YOUR_OPENAI_API_KEY_HERE
```

Then load it using a tool like `dotenv` or manually source it.

**Note:** Use double underscore (`__`) in the environment variable name. This maps to the nested configuration `OpenAI:ApiKey` in .NET.

2. Restore packages:
```bash
dotnet restore
```

3. Run the application:
```bash
dotnet run --project AI-CityHelp.API
```

The API will be available at `http://localhost:5000` (or the port configured in `launchSettings.json`).

## API Endpoints

### POST `/api/classify`
Classify a citizen request.

**Request:**
```json
{
  "requestText": "Пошкоджений люк біля будинку",
  "imageUrl": null
}
```

**Response:**
```json
{
  "category": "Дорожнє господарство",
  "confidence": 0.87,
  "contextUsed": ["..."],
  "rawModelResponse": "{...}"
}
```

### POST `/api/kb/load`
Load knowledge base and generate embeddings.

**Response:**
```json
{
  "status": "ok",
  "itemsLoaded": 15
}
```

### GET `/api/kb/all`
Get all categories from knowledge base.

**Response:**
```json
[
  {
    "id": "road_issues",
    "title": "Дорожнє господарство",
    "description": "..."
  }
]
```

## Swagger UI

When running in Development mode, Swagger UI is available at:
`http://localhost:5000/swagger`

## Knowledge Base

The knowledge base is stored in `kb/categories.json`. It contains 15 municipal service categories.

## Vector Store

The application uses LiteDB for local vector storage. Embeddings are stored in `data/embeddings.db`.

## Logging

Logs are written to:
- Console
- `logs/cityhelp-YYYY-MM-DD.txt`


