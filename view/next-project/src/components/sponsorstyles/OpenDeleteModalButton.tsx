import React, { useState } from 'react';

import DeleteModal from './DeleteModal';
import { DeleteButton } from '@components/common';

export interface Props {
  children?: React.ReactNode;
  id: number;
}

const OpenDeleteModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <DeleteButton onClick={onOpen} />
      {isOpen && <DeleteModal id={props.id} setShowModal={setIsOpen} />}
    </>
  );
};

export default OpenDeleteModalButton;
