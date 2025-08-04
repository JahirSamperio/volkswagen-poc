import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper
} from '@mui/material'
// No icons needed

function DeploymentSummary({ instanceData, gpuInstances = [] }) {
  const allInstances = [
    {
      id: 'main',
      type: instanceData?.instanceType || 'N/A',
      region: 'us-east-1 (Virginia)',
      role: 'Principal',
      status: 'Pendiente'
    },
    ...gpuInstances.map((gpu, index) => ({
      id: `gpu-${index}`,
      type: gpu.type,
      region: 'us-east-1 (Virginia)',
      role: 'GPU Ayuda',
      status: 'Pendiente'
    }))
  ]

  return (
    <Box>
      <Card sx={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', border: '1px solid #E2E8F0' }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
            Instancia a Desplegar
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', border: '1px solid #E2E8F0' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#334155', fontWeight: 600 }}>Tipo</TableCell>
                  <TableCell sx={{ color: '#334155', fontWeight: 600 }}>Región</TableCell>
                  <TableCell sx={{ color: '#334155', fontWeight: 600 }}>Rol</TableCell>
                  <TableCell sx={{ color: '#334155', fontWeight: 600 }}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allInstances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell sx={{ color: '#334155', fontWeight: 500 }}>{instance.type}</TableCell>
                    <TableCell sx={{ color: '#334155' }}>{instance.region}</TableCell>
                    <TableCell>
                      <Chip 
                        label={instance.role}
                        color={instance.role === 'Principal' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={instance.status}
                        color="warning"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>


    </Box>
  )
}

export default DeploymentSummary