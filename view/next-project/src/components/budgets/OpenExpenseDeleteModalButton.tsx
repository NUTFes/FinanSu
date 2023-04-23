import React, { useState } from 'react';

import ExpenseDeleteModal from './ExpenseDeleteModal';
import { DeleteButton } from '@components/common';

interface Props {
  children?: React.ReactNode;
  id: number;
  disabled: boolean;
}

const OpenExpenseDeleteModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <DeleteButton onClick={onOpen} isDisabled={props.disabled} />
      {isOpen && <ExpenseDeleteModal id={props.id} setShowModal={setIsOpen} />}
    </>
  );
};

export default OpenExpenseDeleteModalButton;
