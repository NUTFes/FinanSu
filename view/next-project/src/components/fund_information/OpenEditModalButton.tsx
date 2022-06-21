import { ChakraProvider, Button } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';
import EditModal from '@components/fund_information/EditModal';
import { useState } from 'react';
import { RiPencilFill } from 'react-icons/ri';

interface Teacher {
  id: number;
  name: string;
  position: string;
  department_id: number;
  room: string;
  is_black: boolean;
  remark: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
}

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  id: number;
  teachers: Teacher[];
  currentUser: User;
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
        openModal={showModal}
        setShowModal={setShowModal}
        teachers={props.teachers}
        currentUser={props.currentUser}
      />
    </ChakraProvider>
  );
};

export default OpenEditModalButton;
