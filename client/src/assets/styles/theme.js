// client/src/assets/styles/theme.js
import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    primary: { main: '#2c3e50' },
    secondary: { main: '#3498db' },
    success: { main: '#27ae60' },
    warning: { main: '#f1c40f' },
    error: { main: '#e74c3c' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500 }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: { border: 'none', '& .MuiDataGrid-cell': { borderBottom: 'none' } }
      }
    }
  }
});