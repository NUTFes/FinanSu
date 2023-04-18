import * as React from 'react';
import { useState } from 'react';

import DeleteModal from '@components/teacher/DeleteModal';
import { DeleteButton } from '../common';

interface Props {
  id: number;
  isDisabled: boolean;
}

const OpenDeleteModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);
  const ShowModal = () => {
    setShowModal(true);
  };
  return (
    <>
      <DeleteButton onClick={ShowModal} isDisabled={props.isDisabled} />
      {showModal && <DeleteModal id={props.id} setShowModal={setShowModal} />}
    </>
  );
};

export default OpenDeleteModalButton;
