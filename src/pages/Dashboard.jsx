import { useState, useEffect } from 'react'
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
  Fab,
  CircularProgress,
  Alert
} from '@mui/material'
import { Add as AddIcon, Computer, Memory, Delete as DeleteIcon, Speed, Logout } from '@mui/icons-material'
import { useInstances } from '../context/InstanceContext'
import LaunchFlow from '../components/LaunchFlow'
import GpuFlow from '../components/GpuFlow'
import LoadingScreen from '../components/LoadingScreen'
import { useAuth } from '../components/auth/AuthProvider'

function Dashboard() {
  const { instances, terminateInstance, setInstances, loading, loadUserInstances } = useInstances()
  
  useEffect(() => {
    loadUserInstances()
  }, [])
  const { signOutGlobal } = useAuth()
  const [openLaunchFlow, setOpenLaunchFlow] = useState(false)
  const [openGpuFlow, setOpenGpuFlow] = useState(false)
  const [confirmTerminate, setConfirmTerminate] = useState(null)
  const [error, setError] = useState(null)
  const [loadingMessage, setLoadingMessage] = useState('Creando instancia... Esto puede tardar unos minutos.')

  const handleTerminate = async (instanceId) => {
    try {
      setError(null)
      setLoadingMessage('Terminando instancia EC2... Por favor espere, esto puede demorar algunos minutos.')
      await terminateInstance(instanceId)
      
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
    } catch (err) {
      setError('Error al destruir la instancia. Por favor, inténtalo de nuevo.')
      setConfirmTerminate(null)
    }
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
              {instance.role === 'Principal' && (
                <IconButton
                  size="small"
                  onClick={() => setConfirmTerminate({...instance, destroy: true})}
                  disabled={instance.status === 'Terminada' || loading}
                  title="Destruir"
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                  sx={{
                    color: '#EF4444',
                    width: 32,
                    height: 32,
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.08) !important',
                      color: '#EF4444 !important'
                    },
                    '&:focus': {
                      backgroundColor: 'transparent'
                    },
                    '&:active': {
                      backgroundColor: 'rgba(239, 68, 68, 0.12)'
                    },
                    '&:disabled': {
                      color: '#CBD5E1',
                      backgroundColor: 'transparent'
                    },
                    '& .MuiTouchRipple-root': {
                      display: 'none'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                </IconButton>
              )}
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
              DNS: {instance.ip}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  return (
    <Container maxWidth="lg">
      {loading && <LoadingScreen message={loadingMessage} />}
        <Box sx={{ mt: 4 }}>
        {/* Error Alert */}
        {error && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', background: 'linear-gradient(135deg, #334155, #64748B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
              Panel de Control de Infraestructura para Diseñadores VW
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              Gestiona tus instancias de renderizado y modelado 3D
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Logout />}
              onClick={signOutGlobal}
              sx={{ 
                minWidth: '120px',
                borderColor: '#64748B',
                color: '#475569',
                '&:hover': {
                  borderColor: '#F43F5E !important',
                  backgroundColor: 'rgba(244, 63, 94, 0.08) !important',
                  color: '#F43F5E !important',
                  '& .MuiTouchRipple-root': {
                    display: 'none'
                  }
                }
              }}
            >
              Cerrar Sesión
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setOpenLaunchFlow(true)}
              disabled={principalInstances.length > 0}
              title={principalInstances.length > 0 ? 'Ya tienes una instancia principal activa' : ''}
              sx={{ 
                minWidth: '180px',
                '&:hover': {
                  backgroundImage: 'linear-gradient(135deg, #0F172A, #1E293B)'
                },
                '&:disabled': {
                  backgroundColor: '#94A3B8 !important',
                  color: '#CBD5E1 !important',
                  opacity: 0.6
                }
              }}
            >
              Lanzar Nueva Instancia
            </Button>
          </Box>
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
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setOpenLaunchFlow(true)}
                sx={{ 
                  minWidth: '180px',
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundImage: 'linear-gradient(135deg, #0F172A, #1E293B)'
                  }
                }}
              >
                Lanzar Instancia
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {principalInstances.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
                  <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: '#334155', textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
                      <Computer color="primary" />
                      Instancia principal
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#475569' }}>
                      Servidor principal para tus aplicaciones de modelado y diseño 3D
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Button
                    variant="outlined"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenGpuFlow(true)}
                    disabled={gpuInstances.length >= 3}
                    title={gpuInstances.length >= 3 ? 'Ya tienes el máximo de aceleradores permitidos' : ''}
                    disableRipple
                    sx={{ 
                      minWidth: '220px',
                      borderColor: '#64748B',
                      color: '#64748B',
                      borderWidth: '1.5px',
                      fontWeight: 600,
                      backgroundColor: 'transparent',
                      '&:hover': {
                        borderColor: '#10B981 !important',
                        backgroundColor: 'rgba(16, 185, 129, 0.08) !important',
                        color: '#10B981 !important',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(16, 185, 129, 0.15)'
                      },
                      '&:disabled': {
                        borderColor: '#CBD5E1 !important',
                        color: '#64748B !important',
                        backgroundColor: 'transparent !important',
                        opacity: 0.7,
                        cursor: 'not-allowed'
                      },
                      '& .MuiTouchRipple-root': {
                        display: 'none'
                      }
                    }}
                  >
                    Agregar Acelerador GPU
                  </Button>
                  </Box>
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
          <Button 
            variant="outlined"
            onClick={() => setConfirmTerminate(null)}
            sx={{
              borderColor: '#64748B',
              color: '#475569',
              '&:hover': {
                borderColor: '#475569 !important',
                backgroundColor: 'rgba(71, 85, 105, 0.08) !important',
                color: '#334155 !important',
                '& .MuiTouchRipple-root': {
                  display: 'none'
                }
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleTerminate(confirmTerminate.id)}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Destruyendo...
              </>
            ) : 'Destruir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Dashboard