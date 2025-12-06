import axios from 'axios'
import type {
  ClassificationRequest,
  ClassificationResponse,
  Category,
  LoadKnowledgeBaseResponse,
} from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor for diagnostics
api.interceptors.request.use((config) => {
  // Remove Content-Type header for FormData - Axios will automatically set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  
  const timestamp = new Date().toISOString()
  const log = {
    timestamp,
    endpoint: config.url || '',
    method: config.method?.toUpperCase() || '',
    request: config.data instanceof FormData ? '[FormData]' : config.data,
  }
  console.log('[API Request]', log)
  return config
})

api.interceptors.response.use(
  (response) => {
    const log = {
      timestamp: new Date().toISOString(),
      endpoint: response.config.url || '',
      method: response.config.method?.toUpperCase() || '',
      response: response.data,
    }
    console.log('[API Response]', log)
    return response
  },
  (error) => {
    const log = {
      timestamp: new Date().toISOString(),
      endpoint: error.config?.url || '',
      method: error.config?.method?.toUpperCase() || '',
      error: error.message,
      response: error.response?.data,
    }
    console.error('[API Error]', log)
    return Promise.reject(error)
  }
)

export const classificationApi = {
  classify: async (request: ClassificationRequest | FormData): Promise<ClassificationResponse> => {
    const startTime = Date.now()
    try {
      let response
      if (request instanceof FormData) {
        // Send as multipart/form-data for file upload
        // Axios will automatically set Content-Type with boundary
        response = await api.post<ClassificationResponse>('/classify', request)
      } else {
        // Send as JSON for URL-based requests
        response = await api.post<ClassificationResponse>('/classify', request)
      }
      const duration = Date.now() - startTime
      console.log(`[Classification] Duration: ${duration}ms`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export const knowledgeBaseApi = {
  load: async (): Promise<LoadKnowledgeBaseResponse> => {
    const response = await api.post<LoadKnowledgeBaseResponse>('/kb/load')
    return response.data
  },
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/kb/all')
    return response.data
  },
}

export default api

