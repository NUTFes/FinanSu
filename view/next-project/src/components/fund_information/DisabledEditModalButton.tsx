import { ChakraProvider, Button } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';
import { RiPencilFill } from 'react-icons/ri';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  return (
    <ChakraProvider theme={theme}>
      <Button
        isDisabled
        w='25px'
        h='25px'
        p='0'
        minWidth='0'
        borderRadius='full'
        bgGradient='linear(to-br, primary.1 ,primary.2)'
      >
        <RiPencilFill size={'15px'} color={'white'} />
        {props.children}
      </Button>
    </ChakraProvider>
  );
};

export default OpenEditModalButton;
