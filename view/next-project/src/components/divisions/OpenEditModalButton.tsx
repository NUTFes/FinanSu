import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '../common';
import EditModal from '@components/divisions/EditModal';

interface Division {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  id: number;
  division: Division;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <EditButton onClick={() => setShowModal(true)} />
      {showModal && (
        <EditModal id={props.id} division={props.division} setShowModal={setShowModal} />
      )}
    </>
  );
};

export default OpenEditModalButton;
