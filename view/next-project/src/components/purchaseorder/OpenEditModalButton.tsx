import { ChakraProvider, Button } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';
import PurchaseOrderEditModal from '@components/purchaseorder/PurchaseOrderEditModal';
import { useState } from 'react';
import {RiPencilFill} from "react-icons/ri";

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  id: number;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);
  const ShowModal = () => {
    setShowModal(true);
  };
  return (
    <ChakraProvider theme={theme}>
      <Button
        w='25px'
        h='25px'
        p='0'
        minWidth='0'
        borderRadius='full'
        bgGradient='linear(to-br, primary.1 ,primary.2)'
        onClick={ShowModal}
        _hover={{ background: 'primary.2' }}
      >
        <RiPencilFill size={'15px'} color={'white'} />
        {props.children}
      </Button>
      <PurchaseOrderEditModal id={props.id} openModal={showModal} setShowModal={setShowModal} />
    </ChakraProvider>
  );
};

export default OpenEditModalButton;
