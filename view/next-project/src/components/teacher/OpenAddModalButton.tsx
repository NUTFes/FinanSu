import * as React from 'react';
import { useState } from 'react';

import { Department } from '@/type/common';
import { AddButton } from '@components/common';
import AddModal from '@components/teacher/AddModal';

interface Props {
  departments: Department[];
  children?: React.ReactNode;
}

export default function OpenAddModalButton(props: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AddButton
        onClick={() => {
          setShowModal(true);
        }}
      >
        {props.children}
      </AddButton>
      {showModal && <AddModal setShowModal={setShowModal} departments={props.departments} />}
    </>
  );
}
