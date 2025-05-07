import * as React from 'react';
import { useState } from 'react';

import EditModal from '@components/teacher/EditModal';
import { Department, Teacher } from '@type/common';

import { EditButton } from '../common';

interface Props {
  id: number;
  teacher: Teacher;
  isDisabled: boolean;
  departments: Department[];
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <EditButton onClick={() => setShowModal(true)} isDisabled={props.isDisabled} />
      {showModal && (
        <EditModal
          id={props.id}
          setShowModal={setShowModal}
          teacher={props.teacher}
          departments={props.departments}
        />
      )}
    </>
  );
};

export default OpenEditModalButton;
