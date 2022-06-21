import { ChakraProvider, Button, propNames } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  hover?: any;
  onClick: () => void;
}

const RegistButton: React.FC<Props> = ({ children, width, height, hover, onClick }) => {
  return (
    <ChakraProvider theme={theme}>
      <Button
        color='white'
        bgGradient='linear(to-br, primary.1, primary.2)'
        style={{ height, width }}
        onClick={onClick}
        _hover={hover}
      >
        {children}
      </Button>
    </ChakraProvider>
  );
};

export default RegistButton;
