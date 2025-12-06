export interface ClassificationRequest {
  requestText: string
  imageUrl?: string | null
  contactName?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  priority?: string | null
}

export interface ClassificationResponse {
  category: string
  confidence: number
  contextUsed: string[]
  rawModelResponse: string
}

export interface Category {
  id: string
  title: string
  description: string
}

export interface LoadKnowledgeBaseResponse {
  status: string
  itemsLoaded: number
}

export interface DiagnosticLog {
  timestamp: string
  endpoint: string
  method: string
  request?: any
  response?: any
  duration?: number
  error?: string
}


