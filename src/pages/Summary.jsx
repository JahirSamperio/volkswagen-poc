import { Container, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Summary() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Principal
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Gestiona todas tus instancias EC2 desde el dashboard principal.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/dashboard')}
        >
          Ir al Dashboard
        </Button>
      </Box>
    </Container>
  )
}

export default Summary