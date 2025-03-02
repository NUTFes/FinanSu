import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '../common';
import { Year } from '@/type/common';
import EditModal from '@components/budget_managements/EditBudgetManagementModal';

interface Props {
  phase: number;
  className?: string;
  year?: Year;
  financialRecordId: number;
  divisionId: number;
  festivalItemId: number;
  onSuccess?: (phase: number) => void;
  onClick?: () => void;
}

export default function OpenEditModalButton(props: Props) {
  const [showModal, setShowModal] = useState(false);

  const { phase, year, financialRecordId, divisionId, festivalItemId, onSuccess } = props;
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
          phase={phase}
          year={year}
          financialRecordId={financialRecordId}
          divisionId={divisionId}
          festivalItemId={festivalItemId}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
