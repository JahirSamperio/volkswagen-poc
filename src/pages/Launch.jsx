import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import InstanceForm from '../components/InstanceForm'
import GpuSuggestions from '../components/GpuSuggestions'
import DeploymentSummary from '../components/DeploymentSummary'
import { useInstances } from '../context/InstanceContext'

const steps = [
  'Configurar Instancia Principal',
  'Seleccionar GPU de Ayuda',
  'Revisar y Confirmar'
]

function Launch() {
  const navigate = useNavigate()
  const { addInstances } = useInstances()
  const [activeStep, setActiveStep] = useState(0)
  const [instanceData, setInstanceData] = useState(null)
  const [gpuInstances, setGpuInstances] = useState([])

  const handleNext = () => {
    setActiveStep(prev => prev + 1)
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const handleFormSubmit = (formData) => {
    setInstanceData(formData)
    handleNext()
  }

  const handleGpuSelection = (selectedGpuInstances = []) => {
    setGpuInstances(selectedGpuInstances)
    handleNext()
  }

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return instanceData !== null
      case 1:
        return true // GPU selection is optional
      case 2:
        return true
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <InstanceForm 
            onNext={handleFormSubmit}
            initialData={instanceData}
          />
        )
      case 1:
        return (
          <GpuSuggestions 
            onBack={handleBack}
            onContinue={handleGpuSelection}
          />
        )
      case 2:
        return (
          <DeploymentSummary 
            instanceData={instanceData}
            gpuInstances={gpuInstances}
          />
        )
      default:
        return null
    }
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          Lanzar Instancia EC2
        </Typography>
        
        <Paper sx={{ p: 3, mt: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 400 }}>
            {renderStepContent()}
          </Box>

          {activeStep !== 0 && activeStep !== 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                variant="outlined"
              >
                Atrás
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={() => {
                    addInstances(instanceData, gpuInstances)
                    navigate('/dashboard')
                  }}
                >
                  Confirmar Despliegue
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  variant="contained"
                >
                  Siguiente
                </Button>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  )
}

export default Launch