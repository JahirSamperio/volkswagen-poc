import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

const gpuInstances = [
  {
    id: 'g5-xlarge',
    type: 'g5.xlarge',
    gpu: 'NVIDIA A10G',
    vcpus: 4,
    memory: '16 GB'
  },
  {
    id: 'p3-2xlarge',
    type: 'p3.2xlarge',
    gpu: 'NVIDIA V100',
    vcpus: 8,
    memory: '61 GB'
  },
  {
    id: 'inf2-xlarge',
    type: 'inf2.xlarge',
    gpu: 'AWS Inferentia2',
    vcpus: 4,
    memory: '16 GB'
  },
  {
    id: 'g4dn-xlarge',
    type: 'g4dn.xlarge',
    gpu: 'NVIDIA T4',
    vcpus: 4,
    memory: '16 GB'
  }
]

function GpuSuggestions({ onBack, onContinue }) {
  const [selectedInstances, setSelectedInstances] = useState([])

  const handleInstanceToggle = (instanceId) => {
    setSelectedInstances(prev => {
      // Si ya está seleccionado, deseleccionarlo
      if (prev.includes(instanceId)) {
        return prev.filter(id => id !== instanceId)
      } 
      // Si no hay selecciones previas o es del mismo tipo que las selecciones existentes
      else if (prev.length === 0 || isSameInstanceType(instanceId, prev[0])) {
        // Limitar a máximo 3
        if (prev.length < 3) {
          return [...prev, instanceId]
        }
      } 
      // Si es de diferente tipo, reemplazar todas las selecciones
      else {
        return [instanceId]
      }
      return prev
    })
  }
  
  // Verifica si dos instancias son del mismo tipo
  const isSameInstanceType = (instanceId1, instanceId2) => {
    const instance1 = gpuInstances.find(inst => inst.id === instanceId1)
    const instance2 = gpuInstances.find(inst => inst.id === instanceId2)
    return instance1.type.split('.')[0] === instance2.type.split('.')[0]
  }

  const handleConfirm = () => {
    const selectedData = gpuInstances.filter(instance =>
      selectedInstances.includes(instance.id)
    )
    onContinue(selectedData)
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {selectedInstances.length > 0 && (
        <Alert severity="info" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle />
          {selectedInstances.length === 3 
            ? "Has seleccionado el máximo de 3 instancias GPU. ¡Perfecto para proyectos complejos!" 
            : `Has seleccionado ${selectedInstances.length} ${selectedInstances.length === 1 ? 'instancia' : 'instancias'} GPU. Puedes seleccionar hasta 3 del mismo tipo.`
          }
        </Alert>
      )}
      
      {selectedInstances.length > 0 && selectedInstances.length < 3 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Solo puedes seleccionar instancias del mismo tipo. Máximo 3 instancias.
        </Typography>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {gpuInstances.map((instance) => {
          const isSelected = selectedInstances.includes(instance.id)
          const isDisabled = !isSelected && (selectedInstances.length >= 3 || 
            (selectedInstances.length > 0 && !isSameInstanceType(instance.id, selectedInstances[0])))

          return (
            <Grid item xs={12} md={6} key={instance.id}>
              <Card
                sx={{
                  border: isSelected ? 2 : 1,
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  opacity: isDisabled ? 0.6 : 1
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleInstanceToggle(instance.id)}
                          disabled={isDisabled}
                        />
                      }
                      label=""
                      sx={{ m: 0 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {instance.type}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        GPU: {instance.gpu}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        vCPUs: {instance.vcpus} | Memoria: {instance.memory}
                      </Typography>

                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleConfirm}
          size="large"
        >
          {selectedInstances.length > 0
            ? `Continuar con ${selectedInstances.length} instancia${selectedInstances.length > 1 ? 's' : ''} GPU`
            : 'Continuar sin GPU'
          }
        </Button>
      </Box>
    </Box>
  )
}

export default GpuSuggestions