import { API_CONFIG } from './config.js'

export const apiClient = {
  async post(endpoint, data) {
    // const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    const response = await fetch(`/api/v1${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`)
    }
    
    return result
  }
}