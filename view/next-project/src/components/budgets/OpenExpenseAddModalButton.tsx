import React, { useState } from 'react';

import { AddButton } from '@components/common';
import { Year } from '@type/common';

import ExpenseAddModal from './ExpenseAddModal';

export interface Props {
  children?: React.ReactNode;
  years: Year[];
  disabled: boolean;
}

export const OpenExpenseAddModalButton = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <AddButton
        onClick={() => {
          setIsOpen(true);
        }}
        disabled={props.disabled}
      >
        {props.children}
      </AddButton>
      {isOpen && <ExpenseAddModal setIsOpen={setIsOpen} years={props.years} />}
    </>
  );
};

export default OpenExpenseAddModalButton;
