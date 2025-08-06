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
  }
}