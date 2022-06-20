import { ChakraProvider, Button } from '@chakra-ui/react';
import { RiPencilFill } from 'react-icons/ri';
import * as React from 'react';
import theme from '@assets/theme';

class EditButton extends React.Component {
  render() {
    return (
      <ChakraProvider theme={theme}>
        <Button
          w='25px'
          h='25px'
          p='0'
          minWidth='0'
          borderRadius='full'
          bgGradient='linear(to-br, primary.1 ,primary.2)'
        >
          <RiPencilFill size={'15px'} color={'white'} />
        </Button>
      </ChakraProvider>
    );
  }
}

export default EditButton;
