import { ChakraProvider, Button } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';
import AddModal from '@components/fund_information/AddModal';
import { useState } from 'react';

interface TeachersInformation {
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

interface Department {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  department_id: number;
  role_id: number;
}

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  teachersInformation: TeachersInformation[];
  departments: Department[];
  currentUser: User;
  userID: number | string;
}

export default function OpenAddModalButton(props: Props) {
  const [showModal, setShowModal] = useState(false);
  const ShowModal = () => {
    setShowModal(true);
  };
  return (
    <ChakraProvider theme={theme}>
      <Button
        w={props.width}
        h={props.height}
        color='white'
        bgGradient='linear(to-br, primary.1, primary.2)'
        onClick={ShowModal}
      >
        {props.children}
      </Button>
      <AddModal
        teachersInformation={props.teachersInformation}
        departments={props.departments}
        openModal={showModal}
        setShowModal={setShowModal}
        currentUser={props.currentUser}
        userID={props.userID}
      />
    </ChakraProvider>
  );
}
