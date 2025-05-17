import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '@components/common';
import { Expense } from '@type/common';

import ExpenseEditModal from './ExpenseEditModal';

export interface Props {
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
