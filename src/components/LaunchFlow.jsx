import { useState } from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog
} from '@mui/material'
// No icons needed
import InstanceForm from './InstanceForm'
import GpuSuggestions from './GpuSuggestions'
import DeploymentSummary from './DeploymentSummary'
import { useInstances } from '../context/InstanceContext'

const title = 'Lanzar Nueva Instancia de AWS EC2'
const description = 'Configura y lanza tu instancia principal para aplicaciones de diseño'

function LaunchFlow({ onComplete }) {
  const { addInstances, instances } = useInstances()
  
  // Verificar si ya existe una instancia principal activa
  const hasPrincipalInstance = instances.some(
    inst => inst.role === 'Principal' && inst.status === 'Ejecutándose'
  )
  const [instanceData, setInstanceData] = useState({
    instanceType: ''
  })
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showValidationError, setShowValidationError] = useState(false)

  const handleFormChange = (formData) => {
    setInstanceData(formData)
    if (formData.instanceType && showValidationError) {
      setShowValidationError(false)
    }
  }



  const handleLaunchClick = () => {
    if (instanceData.instanceType) {
      setShowValidationError(false)
      setShowConfirmDialog(true)
    } else {
      setShowValidationError(true)
    }
  }

  const handleConfirmDeploy = () => {
    addInstances(instanceData, [])
    setShowConfirmDialog(false)
    onComplete()
    window.location.href = '/dashboard'
  }

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false)
  }

  return (
    <>
      <DialogTitle sx={{ textAlign: 'center', pb: 1, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#E2E8F0' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#334155' }}>
          {title}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        {hasPrincipalInstance ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Ya tienes una instancia principal activa
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Solo puedes tener una instancia principal a la vez. Destruye la instancia existente antes de crear una nueva.
            </Typography>
          </Box>
        ) : (
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
              <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#334155', fontWeight: 600 }}>
                Configuración
              </Typography>
              <InstanceForm 
                onNext={handleFormChange}
                initialData={instanceData}
                onChange={handleFormChange}
                showValidationError={showValidationError}
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
              <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#334155', fontWeight: 600 }}>
                Vista previa
              </Typography>
              <DeploymentSummary 
                instanceData={instanceData}
                gpuInstances={[]}
              />
            </Box>
          </Box>)}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', px: 4, py: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#E2E8F0' }}>
        <Button
          onClick={onComplete}
          variant="outlined"
          disableRipple
          disableFocusRipple
          disableTouchRipple
          sx={{ 
            mr: 2, 
            borderColor: '#64748B', 
            color: '#475569',
            '&:hover': {
              borderColor: '#475569 !important',
              backgroundColor: 'rgba(71, 85, 105, 0.08) !important',
              color: '#334155 !important'
            },
            '& .MuiTouchRipple-root': {
              display: 'none !important'
            }
          }}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleLaunchClick}
          color="primary"
          variant="contained"
          size="large"
          // disabled={!instanceData.instanceType || hasPrincipalInstance}
          sx={{ bgcolor: '#1E293B', '&:hover': { bgcolor: '#0F172A' } }}
        >
          {hasPrincipalInstance ? 'No disponible' : 'Lanzar Instancia'}
        </Button>
      </DialogActions>

      {/* Dialog de confirmación */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelConfirm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#334155' }}>
            Confirmar lanzamiento de instancia
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿Estás seguro de lanzar la instancia de tipo <strong>"{instanceData.instanceType}"</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Esta acción creará una nueva instancia de AWS EC2 que generará costos.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          <Button
            onClick={handleCancelConfirm}
            variant="outlined"
            sx={{ 
              borderColor: '#64748B', 
              color: '#475569',
              '&:hover': {
                borderColor: '#475569',
                backgroundColor: 'rgba(71, 85, 105, 0.08)'
              }
            }}
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleConfirmDeploy}
            variant="contained"
            sx={{ 
              bgcolor: '#1E293B', 
              '&:hover': { bgcolor: '#0F172A' }
            }}
          >
            Sí, lanzar instancia
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LaunchFlow