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
    blue: {
      50: '#32f3ff',
      100: '#1dbac5',
      200: '#18c4fb',
      300: '#3bdbff',
      400: '#63daff',
      500: '#00c1ed',
    },
    gray: {
      50: '#f7fafc',
      900: '#171923',
    },
  },
});
export default theme;
