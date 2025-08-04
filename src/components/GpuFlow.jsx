import { useState, useEffect } from 'react'


import {
  Box,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import { Memory, Speed } from '@mui/icons-material'
import GpuForm from './GpuForm'
import { useInstances } from '../context/InstanceContext'

function GpuFlow({ onComplete }) {
  const { instances, addGpuInstances } = useInstances()
  
  // Obtener instancias GPU existentes
  const existingGpus = instances.filter(inst => 
    inst.role === 'GPU Ayuda' && inst.status !== 'Terminada'
  )
  
  // Calcular cuántas instancias GPU ya existen
  const existingGpuCount = existingGpus.length
  
  // Determinar el tipo de instancia existente completo (si hay alguna)
  const existingGpuFullType = existingGpuCount > 0 ? existingGpus[0].type : null
  
  // Determinar el tipo base de instancia existente (si hay alguna)
  const existingGpuType = existingGpuCount > 0 ? existingGpus[0].type.split('.')[0] : null
  
  // Calcular cuántas más se pueden agregar
  const remainingSlots = Math.max(0, 3 - existingGpuCount)
  
  // Determinar el tipo de instancia inicial (usar el existente o g4dn.xlarge por defecto)
  const initialInstanceType = existingGpuFullType || 'g4dn.xlarge'
  
  const [formData, setFormData] = useState({
    instanceType: initialInstanceType,
    count: Math.min(remainingSlots, 1) // Limitar el valor inicial según slots disponibles
  })
  
  // Asegurar que la vista previa se actualice inmediatamente al abrir el modal
  useEffect(() => {
    if (initialInstanceType) {
      handleFormChange({
        instanceType: initialInstanceType,
        count: Math.min(remainingSlots, 1)
      })
    }
  }, [])

  const handleFormChange = (data) => {
    // Asegurar que count no exceda los slots disponibles
    const safeData = {
      ...data,
      count: Math.min(data.count, remainingSlots)
    }
    setFormData(safeData)
  }

  const handleConfirm = () => {
    const principalInstance = instances.find(inst => inst.role === 'Principal' && inst.status === 'Ejecutándose')
    if (principalInstance && formData.instanceType) {
      // Crear array de instancias basado en el count
      const gpuInstances = Array(formData.count).fill().map(() => ({
        type: formData.instanceType,
        gpu: getGpuType(formData.instanceType)
      }))
      
      addGpuInstances(principalInstance.id, gpuInstances)
    }
    onComplete()
  }
  
  const getGpuType = (instanceType) => {
    if (instanceType.startsWith('g4')) return 'NVIDIA T4'
    if (instanceType.startsWith('g5')) return 'NVIDIA A10G'
    if (instanceType.startsWith('p3')) return 'NVIDIA V100'
    return 'GPU'
  }

  return (
    <>
      <DialogTitle sx={{ textAlign: 'center', pb: 1, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#E2E8F0' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Memory sx={{ fontSize: 28 }} />
          Agregar Aceleradores GPU
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ 
            flex: '1 1 auto', 
            p: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: '#E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Speed sx={{ fontSize: 22 }} />
              Configuración
            </Typography>
            <GpuForm 
              onChange={handleFormChange} 
              maxCount={remainingSlots} 
              existingGpuType={existingGpuType}
              existingGpuFullType={existingGpuFullType}
            />
          </Box>
          
          <Box sx={{ 
            flex: '1 1 auto',
            p: 3,
            bgcolor: 'background.paper', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: '#E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Memory sx={{ fontSize: 22 }} />
              Vista previa
            </Typography>
            
            <Card sx={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', border: '1px solid #E2E8F0' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Aceleradores a Desplegar
                </Typography>
                
                {formData.instanceType ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" sx={{ color: '#334155', fontWeight: 500 }}>
                        {formData.count}x {formData.instanceType}
                      </Typography>
                      {existingGpuFullType && (
                        <Chip 
                          label="Tipo fijo" 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                          sx={{ height: 20, fontSize: '0.7rem' }} 
                        />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#334155', mt: 1 }}>
                      Región: us-east-1 (Virginia)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#334155', mt: 1 }}>
                      {existingGpuCount > 0 
                        ? `Aceleradores existentes: ${existingGpuCount} (${existingGpuFullType}) | Nuevos: ${formData.count} | Total: ${existingGpuCount + formData.count}` 
                        : `Total: ${formData.count} acelerador${formData.count > 1 ? 'es' : ''}`
                      }
                    </Typography>
                    
                    {remainingSlots === 0 && (
                      <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 500, bgcolor: 'rgba(244, 63, 94, 0.08)', p: 1, borderRadius: 1 }}>
                        Ya tienes el máximo de 3 aceleradores GPU. Elimina alguno para agregar nuevos.
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Selecciona un tipo de acelerador GPU
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', px: 4, py: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#E2E8F0' }}>
        <Button
          onClick={onComplete}
          variant="outlined"
          sx={{ mr: 2, borderColor: '#64748B', color: '#334155' }}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          size="large"
          disabled={!formData.instanceType || remainingSlots === 0}
          sx={{ bgcolor: '#1E293B', '&:hover': { bgcolor: '#0F172A' } }}
        >
          {remainingSlots === 0 
            ? 'Límite máximo alcanzado' 
            : `Agregar ${formData.count} Acelerador${formData.count > 1 ? 'es' : ''} GPU`
          }
        </Button>
      </DialogActions>
    </>
  )
}

export default GpuFlow