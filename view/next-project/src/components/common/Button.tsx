import { ChakraProvider, Button, propNames } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  bgGradient?: string;
  _hover?: any;
  onClick?: () => void;
}

const RegistButton: React.FC<Props> = ({
  children,
  width,
  height,
  bgGradient,
  _hover,
  onClick,
}) => {
  return (
    <ChakraProvider theme={theme}>
      <Button
        color='white'
        bgGradient={bgGradient}
        _hover={{ _hover }}
        style={{ height, width }}
        onClick={onClick}
      >
        {children}
      </Button>
    </ChakraProvider>
  );
};

export default RegistButton;
