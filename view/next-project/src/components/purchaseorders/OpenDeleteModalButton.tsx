import React from 'react';
import { useState } from 'react';

import { DeleteButton } from '@components/common';
import DeleteModal from './DeleteModal';

interface Props {
  id: number;
  isDisabled: boolean;
}

const OpenDeleteModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <DeleteButton onClick={onOpen} isDisabled={props.isDisabled} />
      {isOpen && (
        <DeleteModal
          id={props.id}
          setShowModal={setIsOpen}
        />
      )}
    </>
  );
};

export default OpenDeleteModalButton;
