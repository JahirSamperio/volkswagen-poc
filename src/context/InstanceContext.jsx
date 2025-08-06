import { createContext, useContext, useState } from 'react'
import { instanceService } from '../services/instanceService.js'
import { cognitoService } from '../services/cognitoService.js'
import { API_CONFIG } from '../services/config.js'

const InstanceContext = createContext()

export const useInstances = () => {
  const context = useContext(InstanceContext)
  if (!context) {
    throw new Error('useInstances must be used within InstanceProvider')
  }
  return context
}

export const InstanceProvider = ({ children }) => {
  const [instances, setInstances] = useState([])
  const [loading, setLoading] = useState(false)

  const addInstances = async (instanceData, gpuInstances = []) => {
    setLoading(true)
    try {
      const userId = cognitoService.getUserId() || API_CONFIG.DEFAULT_USER_ID
      
      const response = await instanceService.deployInstance(instanceData.instanceType, userId)
      
      // Actualizar estado local con la respuesta del backend
      const newInstance = {
        id: `i-${Math.random().toString(36).substr(2, 17)}`,
        type: instanceData.instanceType,
        region: 'us-east-1 (Virginia)',
        status: 'Ejecutándose',
        role: 'Principal',
        launchedAt: new Date().toISOString(),
        groupId: `group-${Date.now()}`,
        ip: response.instanceDNS?.[0] || 'Pendiente'
      }
      
      setInstances(prev => [...prev, newInstance])
    } catch (error) {
      console.error('Error deploying instance:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const terminateInstance = async (instanceId) => {
    setLoading(true)
    try {
      const userId = cognitoService.getUserId() || API_CONFIG.DEFAULT_USER_ID
      
      await instanceService.destroyInstance(userId)
      
      setInstances(prev => 
        prev.map(instance => 
          instance.id === instanceId 
            ? { ...instance, status: 'Terminada' }
            : instance
        )
      )
    } catch (error) {
      console.error('Error destroying instance:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const addGpuInstances = (principalInstanceId, gpuInstances) => {
    const groupId = instances.find(inst => inst.id === principalInstanceId)?.groupId
    const newGpuInstances = gpuInstances.map(gpu => ({
      id: `i-${Math.random().toString(36).substr(2, 17)}`,
      type: gpu.type,
      region: 'us-east-1 (Virginia)',
      status: 'Ejecutándose',
      role: 'GPU Ayuda',
      launchedAt: new Date().toISOString(),
      groupId,
      relatedTo: principalInstanceId,
      ip: 'Pendiente'
    }))
    
    setInstances(prev => [...prev, ...newGpuInstances])
  }

  return (
    <InstanceContext.Provider value={{
      instances,
      addInstances,
      terminateInstance,
      addGpuInstances,
      setInstances,
      loading
    }}>
      {children}
    </InstanceContext.Provider>
  )
}