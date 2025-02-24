import clsx from 'clsx';
import * as React from 'react';
import { useState } from 'react';

import { AddButton } from '../common';
import { DivisionWithBalance, FinancialRecordWithBalance } from '@/generated/model';
import AddModal from '@components/budget_managements/AddBudgetManagementModal';

interface Props {
  financialRecord: FinancialRecordWithBalance[];
  divisions: DivisionWithBalance[];
  className?: string;
  children?: React.ReactNode;
}

export default function OpenAddModalButton(props: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AddButton
        className={clsx(props.className)}
        onClick={() => {
          setShowModal(true);
        }}
      >
        {props.children}
      </AddButton>
      {showModal && (
        <AddModal setShowModal={setShowModal} financialRecord={props.financialRecord} divisions={props.divisions} />
      )}
    </>
  );
}
