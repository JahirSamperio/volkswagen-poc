import { Box, CircularProgress, Typography } from '@mui/material'

function LoadingScreen({ message = 'Cargando...' }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
      }}
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ color: '#334155' }}>
        {message}
      </Typography>
    </Box>
  )
}

export default LoadingScreen