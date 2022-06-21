import { ChakraProvider } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';
import PurchaseItemNumModal from '@components/purchaseorders/PurchaseItemNumModal';
import Button from '@components/common/Button';
import { useState } from 'react';

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
      <Button onClick={ShowModal} hover={{ background: 'primary.2' }}>
        {children}
      </Button>
      <PurchaseItemNumModal openModal={showModal} setShowModal={setShowModal} />
    </ChakraProvider>
  );
};

export default OpenModalButton;
