import { ChakraProvider, Button } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';
import DeleteModal from '@components/purchaseorders/DeleteModal';
import { useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  id: number;
}

const OpenDeleteModalButton: React.FC<Props> = (props) => {
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
        bgGradient='linear(to-br, red.500 ,red.600)'
        onClick={ShowModal}
        _hover={{ background: 'red.600' }}
      >
        <RiDeleteBinLine size={'15px'} color={'white'} />
        {props.children}
      </Button>
      <DeleteModal id={props.id} openModal={showModal} setShowModal={setShowModal} />
    </ChakraProvider>
  );
};

export default OpenDeleteModalButton;