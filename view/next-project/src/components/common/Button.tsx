import { ChakraProvider, Button, propNames } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';

interface Props {
  width?: string;
  height?: string;
  mx?: number | string;
  isDisabled?: any;
  variant?: any;
  children?: React.ReactNode;
  hover?: any;
  onClick: () => void;
}

export default function CommonButton(props: Props) {
  return (
    <ChakraProvider theme={theme}>
      <Button
        isDisabled={props.isDisabled}
        mx={props.mx}
        color='white'
        bgGradient='linear(to-br, primary.1, primary.2)'
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
