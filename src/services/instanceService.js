import { apiClient } from './api.js'
import { API_CONFIG } from './config.js'

const generateInstanceName = () => {
  const adjectives = ['turbo', 'ultra', 'pro', 'max', 'premium', 'advanced', 'studio']
  const nouns = ['render', 'modeler', 'designer', 'workstation', 'visualizer', 'creator', 'artist']
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  const randomNum = Math.floor(Math.random() * 1000)
  return `vw-${randomAdj}-${randomNoun}-${randomNum}`
}

export const instanceService = {
  async deployInstance(instanceType, userId = API_CONFIG.DEFAULT_USER_ID) {
    const deployData = {
      user_id: userId,
      instance_name: generateInstanceName(),
      instance_type: instanceType
    }
    
    return apiClient.post(API_CONFIG.ENDPOINTS.DEPLOY, deployData)
  },

  async destroyInstance(userId = API_CONFIG.DEFAULT_USER_ID) {
    const destroyData = {
      user_id: userId
    }
    
    return apiClient.post(API_CONFIG.ENDPOINTS.DESTROY, destroyData)
  },

  async getUserResources(userId = API_CONFIG.DEFAULT_USER_ID) {
    // const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_RESOURCES}/${userId}`, {
    const response = await fetch(`/api/v1${API_CONFIG.ENDPOINTS.USER_RESOURCES}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`)
    }
    
    return result
  }
}