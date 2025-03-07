import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '../common';
import EditModal from '@components/budget_managements/EditBudgetManagementModal';

interface Props {
  phase: number;
  financialRecordId: number;
  divisionId: number;
  festivalItemId: number;
  onSuccess: () => void;
}

export default function OpenEditModalButton(props: Props) {
  const [showModal, setShowModal] = useState(false);

  const { phase, financialRecordId, divisionId, festivalItemId, onSuccess } = props;
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
          financialRecordId={financialRecordId}
          divisionId={divisionId}
          festivalItemId={festivalItemId}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
