import React, { useState } from 'react';

import { AddButton } from '@components/common';
import { Year } from '@type/common';

import ExpenditureAddModal from './ExpenditureAddModal';

export interface Props {
  children?: React.ReactNode;
  years: Year[];
}

export const OpenExpenseAddModalButton = (props: Props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AddButton
        onClick={() => {
          setShowModal(true);
        }}
      >
        {props.children}
      </AddButton>
      {showModal && <ExpenditureAddModal years={props.years} setShowModal={setShowModal} />}
    </>
  );
};

export default OpenExpenseAddModalButton;
