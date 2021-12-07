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
});
export default theme;
