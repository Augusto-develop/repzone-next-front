// next-front/theme/muiTheme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            borderColor: 'hsl(var(--primary))',
          },
        },
      },
    },
  },
});

export default theme;
