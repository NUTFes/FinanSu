import { ChakraProvider, Button } from '@chakra-ui/react';
import * as React from 'react';
import { useState } from 'react';

import theme from '@assets/theme';
import AddModal from '@components/fund_information/AddModal';
import { Teacher, Department, User } from '@type/common'

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  teachersInformation: Teacher[];
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
