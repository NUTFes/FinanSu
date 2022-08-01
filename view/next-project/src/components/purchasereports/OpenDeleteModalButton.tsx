import React from 'react';
import DeleteModal from '@components/purchasereports/DeleteModal';
import { useState } from 'react';
import { DeleteButton } from '@components/common';

interface Props {
  children?: React.ReactNode;
  id: number;
}

const OpenDeleteModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <DeleteButton onClick={onOpen} />
      {
        isOpen ? (
          <DeleteModal id={props.id} openModal={isOpen} setShowModal={setIsOpen} />
        ) : null}
    </>
  );
};

export default OpenDeleteModalButton;