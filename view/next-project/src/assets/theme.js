import { extendTheme } from '@chakra-ui/react';
import '@fontsource/noto-sans-jp';
// import { StepsStyleConfig as Steps } from 'chakra-ui-steps';
const theme = extendTheme({
  // components: {
  //   Steps,
  // },
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
      900: '#999',
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
      3: '#E2E8F0',
      4: '#023859',
      5: '#04668C',
    },
    accent: {
      1: '#E4434E',
      2: '#FF5B6C',
    },
  },
});
export default theme;
