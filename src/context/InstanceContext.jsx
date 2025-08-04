import { createContext, useContext, useState } from 'react'

// Función para generar IPs aleatorias
const generateRandomIp = () => {
  return [
    Math.floor(Math.random() * 255) + 1,
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255)
  ].join('.');
}

const InstanceContext = createContext()

export const useInstances = () => {
  const context = useContext(InstanceContext)
  if (!context) {
    throw new Error('useInstances must be used within InstanceProvider')
  }
  return context
}

export const InstanceProvider = ({ children }) => {
  const [instances, setInstances] = useState([
    {
      id: 'i-1234567890abcdef0',
      type: 'g5.xlarge',
      region: 'us-east-1 (Virginia)',
      status: 'Ejecutándose',
      role: 'Principal',
      launchedAt: new Date().toISOString(),
      groupId: 'group-1',
      ip: '54.205.87.123'
    },
    {
      id: 'i-0987654321fedcba0',
      type: 'g4dn.xlarge',
      region: 'us-east-1 (Virginia)',
      status: 'Ejecutándose',
      role: 'GPU Ayuda',
      launchedAt: new Date().toISOString(),
      groupId: 'group-1',
      relatedTo: 'i-1234567890abcdef0',
      ip: '54.167.92.45'
    },
    {
      id: 'i-abcdef1234567890',
      type: 'p3.2xlarge',
      region: 'us-east-1 (Virginia)',
      status: 'Ejecutándose',
      role: 'GPU Ayuda',
      launchedAt: new Date().toISOString(),
      groupId: 'group-1',
      relatedTo: 'i-1234567890abcdef0',
      ip: '54.152.31.78'
    }
  ])

  const addInstances = (instanceData, gpuInstances = []) => {
    // Terminate existing instances first
    setInstances(prev => prev.map(instance => ({ ...instance, status: 'Terminada' })))
    
    const newInstances = []
    const groupId = `group-${Date.now()}`
    
    // Add main instance
    const mainInstanceId = `i-${Math.random().toString(36).substr(2, 17)}`
    newInstances.push({
      id: mainInstanceId,
      type: instanceData.instanceType,
      region: 'us-east-1 (Virginia)',
      status: 'Ejecutándose',
      role: 'Principal',
      launchedAt: new Date().toISOString(),
      groupId,
      ip: generateRandomIp()
    })

    // Add GPU instances
    gpuInstances.forEach(gpu => {
      newInstances.push({
        id: `i-${Math.random().toString(36).substr(2, 17)}`,
        type: gpu.type,
        region: 'us-east-1 (Virginia)',
        status: 'Ejecutándose',
        role: 'GPU Ayuda',
        launchedAt: new Date().toISOString(),
        groupId,
        relatedTo: mainInstanceId,
        ip: generateRandomIp()
      })
    })

    setInstances(prev => [...prev, ...newInstances])
  }

  const terminateInstance = (instanceId) => {
    setInstances(prev => 
      prev.map(instance => 
        instance.id === instanceId 
          ? { ...instance, status: 'Terminada' }
          : instance
      )
    )
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
      ip: generateRandomIp()
    }))
    
    setInstances(prev => [...prev, ...newGpuInstances])
  }

  return (
    <InstanceContext.Provider value={{
      instances,
      addInstances,
      terminateInstance,
      addGpuInstances,
      setInstances
    }}>
      {children}
    </InstanceContext.Provider>
  )
}