import { ChakraProvider, Button, propNames } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';

interface Props {
  width?: string;
  height?: string;
  onClick?: any;
  children?: React.ReactNode;
  onClick: () => void;
  hover?: any;
}

const DeleteButton: React.FC<Props> = ({ children, width, height, onClick, hover }) => {
  return (
    <ChakraProvider theme={theme}>
      <Button
        color='white'
        bgGradient='linear(to-br, red.500, red.600)'
        style={{ height, width }}
        onClick={onClick}
        _hover={hover}
      >
        {children}
      </Button>
    </ChakraProvider>
  );
};

export default DeleteButton;
