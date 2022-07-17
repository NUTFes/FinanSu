import { ChakraProvider, Button, propNames } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';

interface Props {
  width?: string;
  height?: string;
  mx?: string;
  children?: React.ReactNode;
  onClick: () => void;
  hover?: any;
}

export default function DeleteButton(props: Props) {
  return (
    <ChakraProvider theme={theme}>
      <Button
        mx={props.mx}
        color='white'
        bgGradient='linear(to-br, red.500, red.600)'
        h={props.height}
        w={props.width}
        onClick={props.onClick}
        _hover={props.hover}
      >
        {props.children}
      </Button>
    </ChakraProvider>
  );
}
