import clsx from 'clsx';
import * as React from 'react';
import { useState } from 'react';

import { Division, FinancialRecord } from '@/generated/model';
import { Year } from '@/type/common';
import AddModal from '@components/budget_managements/AddBudgetManagementModal';

import { AddButton } from '../common';

interface FinancialRecordWithId extends FinancialRecord {
  id: number;
}

interface DivisionWithId extends Division {
  id: number;
}

interface Props {
  phase: number;
  year?: Year;
  fr?: FinancialRecordWithId;
  div?: DivisionWithId;
  className?: string;
  children?: React.ReactNode;
  onSuccess: () => void;
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
        <AddModal
          setShowModal={setShowModal}
          phase={props.phase}
          year={props.year}
          fr={props.fr}
          div={props.div}
          onSuccess={props.onSuccess}
        />
      )}
    </>
  );
}
