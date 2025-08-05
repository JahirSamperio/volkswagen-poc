import { useState } from 'react'
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Alert
} from '@mui/material'

const instanceTypes = [
  { value: 'g4dn.xlarge', label: 'g4dn.xlarge - NVIDIA T4' },
  { value: 'g4dn.2xlarge', label: 'g4dn.2xlarge - NVIDIA T4' },
  { value: 'g5.xlarge', label: 'g5.xlarge - NVIDIA A10G' },
  { value: 'g5.2xlarge', label: 'g5.2xlarge - NVIDIA A10G' },
  { value: 'p3.2xlarge', label: 'p3.2xlarge - NVIDIA V100' },
  { value: 'p4d.24xlarge', label: 'p4d.24xlarge - 8x NVIDIA A100' }
]

function InstanceForm({ onNext, initialData = null, onChange = null, showValidationError = false }) {
  const [formData, setFormData] = useState({
    instanceType: initialData?.instanceType || ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.instanceType) newErrors.instanceType = 'Tipo de instancia requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (validateForm()) {
      onNext(formData)
    }
  }
  
  // Notify parent component of changes if onChange is provided
  const handleFieldChange = (field) => (event) => {
    const newValue = event.target.value
    const newFormData = { ...formData, [field]: newValue }
    
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
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Selecciona el tipo de instancia GPU para tus aplicaciones de diseño 3D
      </Typography>
      
      <TextField
        select
        fullWidth
        label="Tipo de Instancia GPU"
        value={formData.instanceType}
        onChange={handleFieldChange('instanceType')}
        error={!!errors.instanceType || (showValidationError && !formData.instanceType)}
        helperText={
          errors.instanceType || 
          (showValidationError && !formData.instanceType ? 'Debes seleccionar un tipo de instancia' : 'Selecciona la potencia de GPU que necesitas')
        }
        margin="normal"
        required
        sx={{ 
          mb: 2,
          '& .MuiOutlinedInput-root': {
            '&.Mui-error': {
              '& fieldset': {
                borderColor: '#F43F5E',
                borderWidth: '2px'
              }
            }
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: '#F43F5E',
            fontWeight: 500
          }
        }}
      >
        {instanceTypes.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      
      {showValidationError && !formData.instanceType && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Por favor selecciona un tipo de instancia antes de continuar
        </Alert>
      )}
    </Box>
  )
}

export default InstanceForm