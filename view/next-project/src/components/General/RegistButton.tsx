import { ChakraProvider, Button, propNames } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';

interface Props {
  width?: string;
  height?: string;
  onClick?: any;
  children?: React.ReactNode;
  onClick: () => void;
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
