import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E48F45',
      dark: '#6B240C',
    },
    secondary: {
      main:"#F5CCA0",
      dark: '#994D1C',
    },
    warning:
    {
      main:`#FF6969`,
      dark:"#C70039"
    }
  },
  typography:
  {
    fontFamily: 'Inter, sans-serif',
    fontSize:14

  },
});

export default theme;
