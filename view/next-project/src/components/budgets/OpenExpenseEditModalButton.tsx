import * as React from 'react';
import { useState } from 'react';

import ExpenseEditModal from './ExpenseEditModal';
import { EditButton } from '@components/common';
import { Expense } from '@type/common';

interface Props {
  id: number;
  expense: Expense;
  disabled: boolean;
}

const OpenExpenseEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <EditButton onClick={onOpen} isDisabled={props.disabled} />
      {isOpen && (
        <ExpenseEditModal expenseId={props.id} setIsOpen={setIsOpen} expense={props.expense} />
      )}
    </>
  );
};

export default OpenExpenseEditModalButton;
