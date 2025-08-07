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

  const loadUserInstances = async () => {
    setLoading(true)
    try {
      const userId = cognitoService.getUserId() || API_CONFIG.DEFAULT_USER_ID
      const response = await instanceService.getUserResources(userId)
      
      const mappedInstances = response.instances.map(instance => {
        const getStatus = (state) => {
          switch (state) {
            case 'running': return 'Ejecutándose'
            case 'pending': return 'Pendiente'
            case 'stopping': return 'Deteniendo'
            case 'stopped': return 'Detenida'
            case 'terminated': return 'Terminada'
            default: return 'Desconocido'
          }
        }
        
        const getRole = (hierarchy) => {
          switch (hierarchy) {
            case 'principal': return 'Principal'
            case 'help': return 'GPU Ayuda'
            default: return 'Desconocido'
          }
        }
        
        return {
          id: instance.InstanceId,
          type: instance.Name,
          region: 'us-east-1 (Virginia)',
          status: getStatus(instance.State),
          role: getRole(instance.hierarchy),
          launchedAt: instance.LaunchTime,
          groupId: `group-${Date.now()}`,
          ip: instance.PrivateIp
        }
      })
      
      setInstances(mappedInstances)
    } catch (error) {
      console.error('Error loading user instances:', error)
      // No lanzar error para no bloquear la UI
    } finally {
      setLoading(false)
    }
  }

  const addInstances = async (instanceData, gpuInstances = []) => {
    setLoading(true)
    try {
      const userId = cognitoService.getUserId() || API_CONFIG.DEFAULT_USER_ID
      
      const response = await instanceService.deployInstance(instanceData.instanceType, userId)
      
      // Actualizar estado local con la respuesta del backend
      const getStatus = (state) => {
        switch (state) {
          case 'running': return 'Ejecutándose'
          case 'pending': return 'Pendiente'
          case 'stopping': return 'Deteniendo'
          case 'stopped': return 'Detenida'
          case 'terminated': return 'Terminada'
          default: return 'Desconocido'
        }
      }
      
      const getRole = (hierarchy) => {
        switch (hierarchy) {
          case 'principal': return 'Principal'
          case 'help': return 'GPU Ayuda'
          default: return 'Desconocido'
        }
      }
      
      const newInstance = {
        id: response.InstanceId,
        type: response.Name,
        region: 'us-east-1 (Virginia)',
        status: getStatus(response.State),
        role: getRole(response.hierarchy),
        launchedAt: response.LaunchTime,
        groupId: `group-${Date.now()}`,
        ip: response.PrivateIp
      }
      
      setInstances(prev => [...prev, newInstance])
      
      // Recargar instancias después del despliegue
      await loadUserInstances()
    } catch (error) {
      console.error('Error deploying instance:', error)
      throw new Error(error.message || 'Error al desplegar la instancia')
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
      throw new Error(error.message || 'Error al terminar la instancia')
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
      loading,
      loadUserInstances
    }}>
      {children}
    </InstanceContext.Provider>
  )
}