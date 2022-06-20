import { ChakraProvider, Button, propNames } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';

interface Props {
  loadingText: string;
  height?: string;
  width?: string;
  children?: React.ReactNode;
}

export default function LoadingButton(props: Props) {
  const loadingText = props.loadingText;
  const height = props.height;
  const width = props.width;
  return (
    <ChakraProvider theme={theme}>
      <Button
        isLoading
        loadingText={loadingText}
        style={{ height, width }}
        color='white'
        bgGradient='linear(to-br, primary.1, primary.2)'
      >
        {props.children}
      </Button>
    </ChakraProvider>
  );
}
