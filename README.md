## **Project:** AI CityHelp — Proof of Concept (PoC)

## **Objective:** RAG-based Classification of Citizen Requests

## **Components:**

1. Backend (.NET 8, RAG engine)
2. Vector Database
3. React + TypeScript UI

---

# 1. **Purpose of the System**

Develop a functional Proof-of-Concept demonstrating AI-driven classification of public municipal service requests using a Retrieval-Augmented Generation (RAG) pipeline.
The PoC should show:

* automatic classification into predefined categories;
* contextual reasoning using a lightweight knowledge base;
* ability to scale the solution into a production module of AI CityHelp;
* user-friendly UI for manual testing.

---

# 2. **Scope of Work**

The PoC includes development of:

1. **Backend (.NET 8 Web API)**
2. **RAG Engine (embeddings + vector search + LLM classification)**
3. **Knowledge Base (JSON or YAML)**
4. **Vector Store (Qdrant or local LiteDB-based embedding store)**
5. **Frontend UI (React + TypeScript)**
6. **Documentation**

Everything must work locally with minimal setup.

---

# 3. **System Architecture**

High-level architecture:

```
React UI → .NET Backend → RAG Engine → Vector DB → LLM Provider
```

### Components:

* **Frontend**
  React application providing input form and result visualization.

* **Backend API**
  RESTful API that exposes request classification and KB management.

* **RAG Engine**

  * Embedding generation
  * Similarity search
  * Prompt construction
  * LLM completion parsing

* **Knowledge Base**
  File-based storage of categories and descriptions.

* **Vector Store**
  Persistent store for embeddings of KB entries.

---

# 4. **Functional Requirements**

## 4.1 Backend Endpoints

### **POST `/classify`**

Processes a free-form citizen request.

**Input JSON:**

```json
{
  "requestText": "Пошкоджений люк біля будинку",
  "imageUrl": null
}
```

**Output JSON:**

```json
{
  "category": "Дорожнє господарство",
  "confidence": 0.87,
  "contextUsed": ["..."],
  "rawModelResponse": "{...}"
}
```

Requirements:

* Return classification result
* Include confidence (provided by LLM or computed)
* Include retrieved KB fragments
* Include raw model response for diagnostics

---

### **POST `/kb/load`**

Loads KB from a file and generates embeddings.

**Output:**

```json
{ "status": "ok", "itemsLoaded": 12 }
```

---

### **GET `/kb/all`**

Returns full list of KB categories.

**Output:**

```json
[
  { "id": "roads", "title": "Дорожнє господарство", "description": "..."},
  ...
]
```

---

## 4.2 RAG Engine Requirements

The RAG engine must:

1. Load KB entries and create embeddings for all text fields.
2. Store embeddings in a vector store.
3. Retrieve **Top-K (K=3)** most similar categories to a given request.
4. Construct a prompt with:

   * system role
   * retrieved context
   * user request
5. Request the LLM to classify strictly in JSON format.
6. Parse and validate JSON response.
7. Return category + confidence.

---

## 4.3 Knowledge Base Requirements

* Format: JSON or YAML file
* Stored in project: `/kb/categories.json`
* Structure example:

```json
[
  {
    "id": "road_issues",
    "title": "Дорожнє господарство",
    "description": "Ями, тротуари, люки, аварійні ділянки..."
  }
]
```

---

## 4.4 Vector Store Requirements

Options:

### **A. Qdrant (preferred)**

* Docker container
* Collection name: `cityhelp_categories`
* Vector size: 1536
* Metric: cosine similarity

### **B. Embedded Local Store (LiteDB)**

* Used if Qdrant is not available
* Must support basic cosine similarity search

---

## 4.5 LLM Requirements

Use one of the following:

* OpenAI / Azure OpenAI
* Local OpenAI-compatible API (e.g. Ollama) — optional fallback

Must support:

* text embedding model
* completion/chat model

---

# 5. **Frontend (React + TypeScript) Requirements**

## 5.1 Pages

### **1. Classification Page (`/classify`)**

UI elements:

* Textarea for request text
* Image upload (optional, placeholder functionality)
* “Classify” button
* Result panel:

  * category
  * confidence
  * retrieved context (collapsible)
  * raw model JSON (collapsible)

### **2. KB Viewer Page (`/kb`)**

* List of categories
* Each item: title + description
* Button to reload KB (calls `/kb/load`)

### **3. Diagnostics Page (`/diagnostics`)**

* API request/response logs
* Vector similarity scores
* Execution time

---

## 5.2 UI/UX Requirements

* Clean, simple layout
* Responsive design (mobile-friendly)
* Use React + TypeScript + Vite
* Optional UI library: MUI or Chakra UI
* Use Axios or Fetch for API calls
* Use React Query for data fetching
* Provide loading & error states

---

# 6. **Non-Functional Requirements**

### 6.1 Performance

* Classification response < 2 seconds (without image)
* KB reload < 5 seconds for <100 entries

### 6.2 Reliability

* If LLM fails, return a structured error
* Backend must be resilient to partially missing data

### 6.3 Logging

* Log all LLM requests/responses
* Log KB load operations
* Log classification time

### 6.4 Security

* API keys stored in environment variables
* No authentication required for PoC
* No persistent user data

---

# 7. **Deliverables**

The contractor must deliver:

### 1. **Backend Source Code (.NET 8)**

* Solution with organized folder structure
* REST API
* RAG logic
* Vector store integration
* KB loader
* Logging

### 2. **Frontend Source Code (React + TypeScript)**

* Full React project
* Pages and components described above
* UX-ready UI for classification testing

### 3. **Knowledge Base**

* JSON file containing at least 8–15 municipal service categories

### 4. **Documentation**

* README with instructions to run backend and frontend
* API documentation
* Architecture description (short)
* Sample API calls

### 5. **Postman Collection**

---

# 8. **Acceptance Criteria**

The PoC is accepted if:

* UI can classify text requests using backend
* RAG pipeline retrieves relevant KB fragments
* Classification results are correct for test cases (≥70% accuracy)
* KB reload works without errors
* UI displays category, confidence, context, and raw JSON
* No critical errors during usage
* Project runs locally with minimal setup (Docker optional)
