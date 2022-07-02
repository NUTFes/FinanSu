import { ChakraProvider, useDisclosure } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';
import PurchaseItemNumModal from '@components/purchaseorders/PurchaseItemNumModal';
import Button from '@components/common/Button';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
}

export default function OpenModalButton(props: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider theme={theme}>
      <Button onClick={onOpen} hover={{ background: 'primary.2' }}>
        {props.children}
      </Button>
      <PurchaseItemNumModal isOpen={isOpen} onClose={onClose} />
    </ChakraProvider>
  );
}
