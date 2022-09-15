import { ChakraProvider, Button } from '@chakra-ui/react';
import * as React from 'react';
import { useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';

import theme from '@assets/theme';
import DeleteModal from '@components/users/DeleteModal';

interface Bureau {
  id: number;
  name: string;
}

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  id: number;
  bureaus: Bureau[];
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
        _hover={{ bg: 'red.600' }}
        onClick={ShowModal}
      >
        <RiDeleteBinLine size={'15px'} color={'white'} />
        {props.children}
      </Button>
      <DeleteModal
        id={props.id}
        bureaus={props.bureaus}
        openModal={showModal}
        setShowModal={setShowModal}
      />
    </ChakraProvider>
  );
};

export default OpenDeleteModalButton;
