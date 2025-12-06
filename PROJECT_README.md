# AI CityHelp - Proof of Concept

RAG-based Classification of Citizen Requests

## Overview

This project is a Proof-of-Concept (PoC) demonstrating AI-driven classification of public municipal service requests using a Retrieval-Augmented Generation (RAG) pipeline.

## Features

- **Automatic Classification**: Classify citizen requests into predefined municipal service categories
- **RAG Pipeline**: Uses embeddings, vector search, and LLM for contextual classification
- **Knowledge Base**: 15 predefined categories covering common municipal services
- **User-Friendly UI**: React-based interface for testing and visualization
- **Diagnostics**: Built-in logging and diagnostics for monitoring

## Project Structure

```
AI-CityHelp-/
├── backend/                 # .NET 8 Web API
│   ├── AI-CityHelp.API/     # Main API project
│   │   ├── Controllers/     # API endpoints
│   │   ├── Services/        # RAG engine, vector store, OpenAI service
│   │   ├── Models/          # Data models
│   │   └── kb/              # Knowledge base JSON file
│   └── README.md            # Backend documentation
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── pages/           # Classification, KB Viewer, Diagnostics
│   │   ├── services/        # API client
│   │   └── types/           # TypeScript types
│   └── README.md            # Frontend documentation
├── SETUP.md                 # Setup instructions
├── ARCHITECTURE.md          # Architecture overview
├── postman_collection.json  # Postman API collection
└── README.md                # Technical specification
```

## Quick Start

### 1. Backend Setup

```bash
cd backend/AI-CityHelp.API

# Set OpenAI API key (Windows PowerShell)
$env:OpenAI__ApiKey="your-api-key-here"

# Or edit appsettings.json

# Restore and run
dotnet restore
dotnet run
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Initial Setup

1. Open the frontend in your browser
2. Navigate to "Knowledge Base" page
3. Click "Reload KB" to load categories and generate embeddings
4. Navigate to "Classification" page to test

## API Endpoints

- `POST /api/classify` - Classify a citizen request
- `POST /api/kb/load` - Load knowledge base and generate embeddings
- `GET /api/kb/all` - Get all categories

See `SETUP.md` for detailed API documentation.

## Knowledge Base

The knowledge base contains 15 categories:
- Дорожнє господарство (Road Infrastructure)
- Вивіз сміття (Waste Management)
- Водопостачання (Water Supply)
- Опалення (Heating)
- Електропостачання (Electricity)
- Парки та озеленення (Parks & Greenery)
- Громадський транспорт (Public Transport)
- Прибирання вулиць (Street Cleaning)
- Громадська безпека (Public Safety)
- Житлові питання (Housing Issues)
- Шумове забруднення (Noise Pollution)
- Паркування (Parking)
- Соціальні послуги (Social Services)
- Екологічні проблеми (Environmental Issues)
- Інше (Other)

## Technology Stack

### Backend
- .NET 8
- OpenAI API (embeddings + chat)
- LiteDB (vector store)
- Serilog (logging)

### Frontend
- React 18
- TypeScript
- Vite
- Material-UI
- React Query
- Axios

## Documentation

- **SETUP.md** - Detailed setup and configuration instructions
- **ARCHITECTURE.md** - System architecture and component details
- **backend/README.md** - Backend-specific documentation
- **frontend/README.md** - Frontend-specific documentation

## Testing

### Sample Test Cases

1. "Пошкоджений люк біля будинку" → Дорожнє господарство
2. "Не вивозять сміття вже тиждень" → Вивіз сміття
3. "Відсутня вода в квартирі" → Водопостачання
4. "Не працює опалення" → Опалення

## Performance

- Classification: < 2 seconds (target)
- KB Load: < 5 seconds for 15 categories
- Vector Search: In-memory with LiteDB persistence

## Requirements Met

✅ Backend .NET 8 Web API with RAG engine  
✅ Vector Database (LiteDB with cosine similarity)  
✅ React + TypeScript UI  
✅ Knowledge Base (15 categories in JSON)  
✅ All required API endpoints  
✅ Documentation and setup instructions  
✅ Postman collection  

## License

This is a Proof-of-Concept project.


