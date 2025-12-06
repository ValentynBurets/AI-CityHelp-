# AI CityHelp - Architecture Overview

## System Architecture

```
┌─────────────┐
│  React UI   │
│  (Port 5173)│
└──────┬──────┘
       │ HTTP/REST
       │
┌──────▼─────────────────────────────────────┐
│     .NET 8 Web API (Port 5000)            │
│  ┌──────────────────────────────────────┐ │
│  │  Controllers                          │ │
│  │  - ClassificationController           │ │
│  │  - KnowledgeBaseController            │ │
│  └──────────────┬───────────────────────┘ │
│                 │                          │
│  ┌──────────────▼───────────────────────┐ │
│  │  RAG Engine Service                   │ │
│  │  - Embedding Generation               │ │
│  │  - Vector Search                      │ │
│  │  - LLM Classification                 │ │
│  └──────────────┬───────────────────────┘ │
│                 │                          │
│  ┌──────────────▼───────────────────────┐ │
│  │  OpenAI Service                       │ │
│  │  - text-embedding-3-small            │ │
│  │  - gpt-4o-mini                       │ │
│  └──────────────────────────────────────┘ │
│                 │                          │
│  ┌──────────────▼───────────────────────┐ │
│  │  Vector Store (LiteDB)                │ │
│  │  - Embedding Storage                  │ │
│  │  - Cosine Similarity Search          │ │
│  └──────────────────────────────────────┘ │
│                 │                          │
│  ┌──────────────▼───────────────────────┐ │
│  │  Knowledge Base Service               │ │
│  │  - Load from JSON                     │ │
│  │  - Category Management                │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

## Component Details

### Frontend (React + TypeScript)

**Pages:**
- **ClassificationPage**: Main UI for submitting requests and viewing results
- **KnowledgeBasePage**: View and reload knowledge base categories
- **DiagnosticsPage**: View API request/response logs

**Key Libraries:**
- React Router for navigation
- React Query for data fetching
- Material-UI for components
- Axios for HTTP requests

### Backend (.NET 8)

**Controllers:**
- `ClassificationController`: Handles `/api/classify` endpoint
- `KnowledgeBaseController`: Handles `/api/kb/*` endpoints

**Services:**
- `RagEngineService`: Orchestrates the RAG pipeline
- `OpenAIService`: Interfaces with OpenAI API for embeddings and classification
- `VectorStoreService`: Manages vector storage and similarity search
- `KnowledgeBaseService`: Loads and manages category data

**Models:**
- `ClassificationRequest/Response`: API request/response DTOs
- `Category`: Knowledge base category structure
- `CategoryEmbedding`: Category with embedding vector

## RAG Pipeline Flow

1. **Request Reception**: User submits text request via UI
2. **Embedding Generation**: Request text is converted to embedding vector using OpenAI
3. **Vector Search**: Top-K (K=3) most similar categories are retrieved from vector store
4. **Context Construction**: Retrieved categories are formatted as context
5. **LLM Classification**: GPT-4o-mini classifies the request using the context
6. **Response Parsing**: JSON response is parsed and returned to user

## Data Flow

### Knowledge Base Loading

```
JSON File → KnowledgeBaseService → OpenAI (Embeddings) → VectorStoreService → LiteDB
```

### Classification Request

```
User Input → ClassificationController → RagEngineService
  → OpenAI (Request Embedding)
  → VectorStoreService (Similarity Search)
  → OpenAI (LLM Classification)
  → ClassificationResponse → User
```

## Vector Store

**Implementation**: LiteDB (embedded database)

**Storage Structure:**
- Collection: `categories`
- Each document contains:
  - Category ID, Title, Description
  - Embedding vector (1536 dimensions for text-embedding-3-small)

**Similarity Search:**
- Cosine similarity calculation
- Returns top-K most similar categories

## Knowledge Base

**Format**: JSON file (`kb/categories.json`)

**Structure:**
```json
[
  {
    "id": "road_issues",
    "title": "Дорожнє господарство",
    "description": "..."
  }
]
```

**Categories**: 15 predefined municipal service categories

## Security Considerations

- API keys stored in configuration (not in source code)
- CORS configured for frontend origins
- No authentication required for PoC
- No persistent user data

## Performance

- **Classification**: < 2 seconds (target)
- **KB Load**: < 5 seconds for 15 categories
- **Vector Search**: In-memory with LiteDB persistence

## Logging

- **Backend**: Serilog to console and file (`logs/cityhelp-*.txt`)
- **Frontend**: Console logs captured in Diagnostics page

## Future Enhancements

- Qdrant integration for production vector store
- Image processing for imageUrl parameter
- Authentication and authorization
- Rate limiting
- Caching for frequently requested categories
- Batch classification support


