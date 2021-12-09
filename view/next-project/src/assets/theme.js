import { extendTheme } from '@chakra-ui/react';
import '@fontsource/noto-sans-jp';
const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: 'Noto Sans JP',
        fontSize: '14px',
        lineHeight: '1.5',
        fontWeight: '500',
      },
    },
  },
  colors: {
    transparent: 'transparent',
    black: {
      0: '#000',
      300: '#333',
      600: '#666',
    },
    white: {
      0: '#fff',
      100: '#f2f2f2',
    },
    gray: {
      50: '#f7fafc',
      900: '#171923',
    },
    base: {
      1: '#2E373F',
      2: '#FFFFFF',
    },
    primary: {
      1: '#56DAFF',
      2: '#1DBCC5',
    },
    accent: {
      1: '#E4434E',
      2: '#FF5B6C',
    },
  },
});
export default theme;
