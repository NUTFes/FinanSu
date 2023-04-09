import { ChakraProvider, Button } from '@chakra-ui/react';
import * as React from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';

import theme from '@assets/theme';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
}

const OpenDeleteModalButton: React.FC<Props> = (props) => {
  return (
    <ChakraProvider theme={theme}>
      <Button
        isDisabled
        w='25px'
        h='25px'
        p='0'
        minWidth='0'
        borderRadius='full'
        bgGradient='linear(to-br, red.500 ,red.600)'
        _hover={{ bg: 'red.600' }}
      >
        <RiDeleteBinLine size={'15px'} color={'white'} />
        {props.children}
      </Button>
    </ChakraProvider>
  );
};

export default OpenDeleteModalButton;
