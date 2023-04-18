import * as React from 'react';
import { useState } from 'react';

import AddModal from '@components/teacher/AddModal';
import { AddButton } from '../common';

interface Props {
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
      {showModal && <AddModal setShowModal={setShowModal} />}
    </>
  );
}
