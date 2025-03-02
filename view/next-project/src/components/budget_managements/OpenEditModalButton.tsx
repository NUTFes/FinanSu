import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '../common';
import { Division, FinancialRecord } from '@/generated/model';
import { Year } from '@/type/common';
import EditModal from '@components/budget_managements/EditBudgetManagementModal';

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
}

export default function OpenEditModalButton(props: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <EditButton
        onClick={() => {
          setShowModal(true);
        }}
      />
      {showModal && (
        <EditModal
          setShowModal={setShowModal}
          phase={props.phase}
          year={props.year}
          fr={props.fr}
          div={props.div}
        />
      )}
    </>
  );
}
