import { useState } from 'react'
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material'

const instanceTypes = [
  { value: 'g4dn.xlarge', label: 'g4dn.xlarge - NVIDIA T4' },
  { value: 'g4dn.2xlarge', label: 'g4dn.2xlarge - NVIDIA T4' },
  { value: 'g5.xlarge', label: 'g5.xlarge - NVIDIA A10G' },
  { value: 'g5.2xlarge', label: 'g5.2xlarge - NVIDIA A10G' },
  { value: 'p3.2xlarge', label: 'p3.2xlarge - NVIDIA V100' }
]

function GpuForm({ onChange, maxCount = 3, existingGpuType = null, existingGpuFullType = null }) {
  // Filtrar tipos de instancia disponibles si ya existe un tipo
  const availableInstanceTypes = existingGpuType
    ? instanceTypes.filter(type => type.value.startsWith(existingGpuType))
    : instanceTypes

  // Asegurar que siempre haya un tipo seleccionado
  const defaultType = existingGpuFullType || 
    (availableInstanceTypes.length > 0 ? availableInstanceTypes[0].value : 'g4dn.xlarge')
  
  const [formData, setFormData] = useState({
    instanceType: defaultType,
    count: Math.min(maxCount, 1)
  })
  
  // Notificar al componente padre del valor inicial
  if (onChange && formData.instanceType) {
    setTimeout(() => onChange(formData), 0)
  }
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (event) => {
    const newValue = event.target.value
    const newFormData = { 
      ...formData, 
      [field]: newValue 
    }
    
    setFormData(newFormData)
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
    
    if (onChange) {
      onChange(newFormData)
    }
  }

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {existingGpuType 
          ? `Selecciona la cantidad de aceleradores GPU tipo ${existingGpuFullType} adicionales` 
          : 'Selecciona el tipo y cantidad de aceleradores GPU para tus proyectos de renderizado'
        }
      </Typography>
      
      <TextField
        select
        fullWidth
        label="Tipo de Acelerador GPU"
        value={formData.instanceType}
        onChange={handleChange('instanceType')}
        error={!!errors.instanceType}
        helperText={errors.instanceType || (existingGpuType ? `Solo puedes agregar aceleradores tipo ${existingGpuFullType}` : 'Selecciona el tipo de GPU que necesitas')}
        disabled={existingGpuType !== null}
        margin="normal"
        required
        sx={{ 
          mb: 3,
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: '#0F172A',
            fontWeight: 500
          },
          '& .MuiOutlinedInput-notchedOutline': existingGpuType && {
            borderColor: 'rgba(0, 0, 0, 0.23) !important'
          }
        }}
      >
        {availableInstanceTypes.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <FormControl fullWidth margin="normal">
        <InputLabel id="count-label">Cantidad de Aceleradores</InputLabel>
        <Select
          labelId="count-label"
          value={formData.count}
          onChange={handleChange('count')}
          label="Cantidad de Aceleradores"
          disabled={maxCount === 0}
        >
          <MenuItem value={1} disabled={maxCount < 1}>1 Acelerador</MenuItem>
          <MenuItem value={2} disabled={maxCount < 2}>2 Aceleradores</MenuItem>
          <MenuItem value={3} disabled={maxCount < 3}>3 Aceleradores</MenuItem>
          {maxCount === 0 && <MenuItem value={0}>No disponible</MenuItem>}
        </Select>
        <FormHelperText>
          {maxCount === 0 
            ? "Límite máximo de 3 aceleradores alcanzado" 
            : maxCount < 3 
              ? `Puedes agregar ${maxCount} acelerador${maxCount > 1 ? 'es' : ''} más` 
              : "Máximo 3 aceleradores del mismo tipo"}
        </FormHelperText>
      </FormControl>
    </Box>
  )
}

export default GpuForm