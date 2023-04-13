import { Button, ChakraProvider } from '@chakra-ui/react';
import * as React from 'react';
import { useState } from 'react';
import { RiPencilFill } from 'react-icons/ri';

import theme from '@assets/theme';
import EditModal from '@components/teacher/EditModal';
import { Department, Teacher } from '@type/common';
import { EditButton } from '../common';

interface Props {
  id: number;
  teacher: Teacher;
  isDisabled: boolean;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <EditButton onClick={() => setShowModal(true)} isDisabled={props.isDisabled} />
      {showModal && <EditModal id={props.id} setShowModal={setShowModal} teacher={props.teacher} />}
    </>
  );
};

export default OpenEditModalButton;
