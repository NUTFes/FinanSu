import { ChakraProvider, Button } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';
import EditModal from '@components/user/EditModal';
import { useState } from 'react';
import { RiPencilFill } from 'react-icons/ri';

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
      >
        <RiPencilFill size={'15px'} color={'white'} />
        {props.children}
      </Button>
      <EditModal
        id={props.id}
        bureaus={props.bureaus}
        openModal={showModal}
        setShowModal={setShowModal}
      />
    </ChakraProvider>
  );
};

export default OpenEditModalButton;
