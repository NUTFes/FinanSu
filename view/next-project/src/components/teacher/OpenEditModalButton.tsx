import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '../common';
import EditModal from '@components/teacher/EditModal';
import { Teacher } from '@type/common';

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
