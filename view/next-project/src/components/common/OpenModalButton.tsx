import { ChakraProvider, Button } from '@chakra-ui/react';
import * as React from 'react';
import { useState } from 'react';

import RegistModal from './RegistModal';
import theme from '@assets/theme';


interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
}

const OpenModalButton: React.FC<Props> = ({ children, width, height }) => {
  const [showModal, setShowModal] = useState(false);
  const ShowModal = () => {
    setShowModal(true);
  };
  return (
    <ChakraProvider theme={theme}>
      <Button
        color='white'
        bgGradient='linear(to-br, primary.1, primary.2)'
        style={{ height, width }}
        onClick={ShowModal}
      >
        {children}
      </Button>
      <RegistModal openModal={showModal} setShowModal={setShowModal} />
    </ChakraProvider>
  );
};

export default OpenModalButton;
