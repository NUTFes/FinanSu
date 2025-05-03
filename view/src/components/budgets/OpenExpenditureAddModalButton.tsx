import React, { useState } from 'react';

import ExpenditureAddModal from './ExpenditureAddModal';
import { AddButton } from '@components/common';
import { Year } from '@type/common';

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
