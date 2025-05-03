import { ChakraProvider, Button } from '@chakra-ui/react';
import * as React from 'react';

import theme from '@assets/theme';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const RegistButton: React.FC<Props> = ({ children, width, height, onClick }) => {
  return (
    <ChakraProvider theme={theme}>
      <Button
        color='white'
        bgGradient='linear(to-br, primary.1, primary.2)'
        style={{ height, width }}
        onClick={onClick}
      >
        {children}
      </Button>
    </ChakraProvider>
  );
};

export default RegistButton;
