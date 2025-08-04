import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { InstanceProvider } from './context/InstanceContext'
import Dashboard from './pages/Dashboard'
import Launch from './pages/Launch'
import Summary from './pages/Summary'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#475569', // Gris azulado - profesional y sobrio
      dark: '#334155',
      light: '#64748B'
    },
    secondary: {
      main: '#64748B', // Gris medio - elegante
      dark: '#475569',
      light: '#94A3B8'
    },
    background: {
      default: '#E2E8F0', // Gris más oscuro - neutro
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0F172A', // Casi negro - más profesional
      secondary: '#475569'
    },
    success: {
      main: '#10B981', // Verde esmeralda - moderno
      dark: '#059669',
      light: '#A7F3D0'
    },
    warning: {
      main: '#F59E0B',
      dark: '#D97706',
      light: '#FDE68A'
    },
    error: {
      main: '#F43F5E', // Rosa/rojo - más creativo que rojo puro
      dark: '#E11D48',
      light: '#FDA4AF'
    },
    divider: '#E2E8F0',
    action: {
      hover: 'rgba(14, 165, 233, 0.08)'
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
      A100: '#F1F5F9',
      A200: '#E2E8F0',
      A400: '#94A3B8',
      A700: '#334155'
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em'
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em'
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(to bottom right, #E2E8F0, #F1F5F9)',
          minHeight: '100vh'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
          border: '1px solid rgba(203, 213, 225, 0.8)',
          backgroundColor: '#FFFFFF',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderColor: '#7DD3FC'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: '0 8px 16px -4px rgba(51, 65, 85, 0.25)',
            transform: 'translateY(-1px)'
          },
          '&.MuiButton-contained': {
            backgroundImage: 'linear-gradient(135deg, #1E293B, #334155)',
            color: '#FFFFFF'
          },
          '&.MuiButton-outlined': {
            borderWidth: '1.5px',
            borderColor: '#64748B',
            color: '#334155'
          },
          '&.Mui-disabled': {
            backgroundColor: '#94A3B8',
            color: '#E2E8F0'
          }
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(226, 232, 240, 0.6)' // Gris claro
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#E2E8F0',
          padding: '12px 16px'
        },
        head: {
          fontWeight: 600,
          color: '#0284C7'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          '&.MuiChip-colorPrimary': {
            backgroundImage: 'linear-gradient(135deg, #1E293B, #334155)',
            color: '#FFFFFF'
          },
          '&.MuiChip-colorSecondary': {
            backgroundImage: 'linear-gradient(135deg, #334155, #475569)',
            color: '#FFFFFF'
          },
          '&.MuiChip-colorSuccess': {
            backgroundImage: 'linear-gradient(135deg, #059669, #10B981)',
            color: '#FFFFFF'
          },
          '&.MuiChip-colorWarning': {
            backgroundImage: 'linear-gradient(135deg, #D97706, #F59E0B)',
            color: '#FFFFFF'
          },
          '&.MuiChip-colorError': {
            backgroundImage: 'linear-gradient(135deg, #DC2626, #EF4444)',
            color: '#FFFFFF'
          }
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'linear-gradient(135deg, #1E293B, #334155)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #0F172A, #1E293B)'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          backgroundImage: 'linear-gradient(to bottom right, #FFFFFF, #E2E8F0)',
          overflow: 'hidden'
        }
      }
    }
  }
})

function App() {
  return (
    <InstanceProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/launch" element={<Launch />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </ThemeProvider>
    </InstanceProvider>
  )
}

export default App