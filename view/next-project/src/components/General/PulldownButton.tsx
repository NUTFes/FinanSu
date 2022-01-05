import { ChakraProvider, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from "@chakra-ui/icons";
import * as React from 'react';
import theme from '@assets/theme';

class PulldownButton extends React.Component {
  render() {
    return (
      <ChakraProvider theme={theme}>
        <Button
          background="transparent"
          w='25px'
          h='25px'
          p='0'
          minWidth='0'
          borderRadius='full' 
        >
          <ChevronDownIcon />
        </Button>
      </ChakraProvider>
    );
  }
}

export default PulldownButton;