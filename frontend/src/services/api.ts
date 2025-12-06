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

api.interceptors.request.use((config) => {
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
    let response
    if (request instanceof FormData) {
      response = await api.post<ClassificationResponse>('/classify', request)
    } else {
      response = await api.post<ClassificationResponse>('/classify', request)
    }
    const duration = Date.now() - startTime
    console.log(`[Classification] Duration: ${duration}ms`)
    return response.data
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

