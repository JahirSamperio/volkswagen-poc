import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab
} from '@mui/material'
import { Add as AddIcon, Computer, Memory, Delete as DeleteIcon, Speed } from '@mui/icons-material'
import { useInstances } from '../context/InstanceContext'
import LaunchFlow from '../components/LaunchFlow'
import GpuFlow from '../components/GpuFlow'

function Dashboard() {
  const { instances, terminateInstance, setInstances } = useInstances()
  const [openLaunchFlow, setOpenLaunchFlow] = useState(false)
  const [openGpuFlow, setOpenGpuFlow] = useState(false)
  const [confirmTerminate, setConfirmTerminate] = useState(null)

  const handleTerminate = (instanceId) => {
    // Verificar si es una instancia principal
    const instanceToDelete = instances.find(inst => inst.id === instanceId)
    
    if (instanceToDelete && instanceToDelete.role === 'Principal') {
      // Si es principal, eliminar también todas las instancias GPU relacionadas
      setInstances(prev => prev.filter(instance => 
        instance.id !== instanceId && instance.relatedTo !== instanceId
      ))
    } else {
      // Si es GPU, solo eliminar esa instancia
      setInstances(prev => prev.filter(instance => instance.id !== instanceId))
    }
    
    setConfirmTerminate(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ejecutándose': return 'success'
      case 'Terminada': return 'error'
      case 'Pendiente': return 'warning'
      default: return 'default'
    }
  }

  const activeInstances = instances.filter(instance => instance.status !== 'Terminada')
  const principalInstances = activeInstances.filter(instance => instance.role === 'Principal')
  const gpuInstances = activeInstances.filter(instance => instance.role === 'GPU Ayuda')

  const getRelatedPrincipal = (gpuInstance) => {
    return instances.find(inst => inst.id === gpuInstance.relatedTo)
  }

  const renderInstanceCard = (instance) => {
    const relatedPrincipal = instance.role === 'GPU Ayuda' ? getRelatedPrincipal(instance) : null
    
    return (
      <Grid item xs={12} md={6} lg={4} key={instance.id}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="h3" sx={{ color: '#0F172A', fontWeight: 600 }}>
                {instance.type}
              </Typography>
              <IconButton
                color="error"
                size="small"
                onClick={() => setConfirmTerminate({...instance, destroy: true})}
                disabled={instance.status === 'Terminada'}
                title="Destruir"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            
            <Typography variant="body2" sx={{ color: '#334155' }} gutterBottom>
              ID: {instance.id}
            </Typography>
            
            {relatedPrincipal && (
              <Typography variant="body2" sx={{ color: '#2563EB', fontWeight: 500 }} gutterBottom>
                Conectada a: {relatedPrincipal.type}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                label={instance.status}
                color={getStatusColor(instance.status)}
                size="small"
              />
              <Chip 
                label={instance.role}
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Typography variant="body2" sx={{ color: '#334155' }}>
              Región: {instance.region}
            </Typography>
            <Typography variant="body2" sx={{ color: '#334155', mt: 1 }}>
              IP: {instance.ip}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  return (
    <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', background: 'linear-gradient(135deg, #334155, #64748B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
              Panel de Control de Infraestructura para Diseñadores VW
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              Gestiona tus instancias de renderizado y modelado 3D
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setOpenLaunchFlow(true)}
            disabled={principalInstances.length > 0}
            title={principalInstances.length > 0 ? 'Ya tienes una instancia principal activa' : ''}
          >
            Lanzar Nueva Instancia
          </Button>
        </Box>

        {activeInstances.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                ¡Bienvenido al Panel de Control!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                No tienes instancias activas. Lanza tu primera instancia de AWS EC2 para comenzar con tus proyectos de diseño y renderizado.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenLaunchFlow(true)}
              >
                Lanzar Instancia
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {principalInstances.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: '#334155', textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
                      <Computer color="primary" />
                      Instancia principal
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#475569' }}>
                      Servidor principal para tus aplicaciones de modelado y diseño 3D
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Memory />}
                    onClick={() => setOpenGpuFlow(true)}
                    title={gpuInstances.length >= 3 ? 'Ya tienes el máximo de aceleradores permitidos' : ''}
                  >
                    Agregar Acelerador GPU
                  </Button>
                </Box>
                <Grid container spacing={3}>
                  {principalInstances.map(renderInstanceCard)}
                </Grid>
              </Box>
            )}

            {gpuInstances.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: '#475569', textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
                  <Speed color="secondary" />
                  Aceleradores de Renderizado ({gpuInstances.length})
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', mb: 3 }}>
                  Servidores GPU especializados que aceleran tus proyectos de renderizado
                </Typography>
                <Grid container spacing={3}>
                  {gpuInstances.map(renderInstanceCard)}
                </Grid>
              </Box>
            )}
          </>
        )}

        <Fab
          color="primary"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            opacity: principalInstances.length > 0 ? 0.6 : 1,
            pointerEvents: principalInstances.length > 0 ? 'none' : 'auto'
          }}
          onClick={() => setOpenLaunchFlow(true)}
          title={principalInstances.length > 0 ? 'Ya tienes una instancia principal activa' : ''}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Dialog
        open={openLaunchFlow}
        onClose={() => setOpenLaunchFlow(false)}
        maxWidth="lg"
        fullWidth
      >
        <LaunchFlow onComplete={() => setOpenLaunchFlow(false)} />
      </Dialog>

      <Dialog
        open={openGpuFlow}
        onClose={() => setOpenGpuFlow(false)}
        maxWidth="lg"
        fullWidth
      >
        <GpuFlow onComplete={() => setOpenGpuFlow(false)} />
      </Dialog>

      <Dialog
        open={!!confirmTerminate}
        onClose={() => setConfirmTerminate(null)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres destruir la instancia {confirmTerminate?.type}?
          </Typography>
          {confirmTerminate?.role === 'Principal' && (
            <Typography color="error" sx={{ mt: 2, fontWeight: 500 }}>
              ADVERTENCIA: Esto también eliminará todos los aceleradores GPU conectados a esta instancia principal.
            </Typography>
          )}
          <Typography color="error" sx={{ mt: 2 }}>
            Esta acción eliminará permanentemente la instancia y todos sus datos asociados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmTerminate(null)}>
            Cancelar
          </Button>
          <Button
            onClick={() => handleTerminate(confirmTerminate.id)}
            color="error"
            variant="contained"
          >
            Destruir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Dashboard