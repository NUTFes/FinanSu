import * as React from 'react';
import { useState } from 'react';

import { DeleteButton } from '../common';
import DeleteModal from '@components/divisions/DeleteModal';

interface Division {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  isDisabled: boolean;
  deleteDivisions: {
    divisions: Division[];
    ids: number[];
  };
}

const OpenDeleteModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <DeleteButton onClick={() => setShowModal(true)} isDisabled={props.isDisabled} />
      {showModal && (
        <DeleteModal deleteDivisions={props.deleteDivisions} setShowModal={setShowModal} />
      )}
    </>
  );
};

export default OpenDeleteModalButton;
