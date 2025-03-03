import * as React from 'react';
import { useState } from 'react';

import { DeleteButton } from '../common';
import DeleteModal from '@components/budget_managements/DeleteBudgetManagementModal';

interface Props {
  phase: number;
  className?: string;
  id: number;
  name: string;
  onSuccess?: () => void;
}

export default function OpenDeleteModalButton(props: Props) {
  const [showModal, setShowModal] = useState(false);

  const { phase, id, name, onSuccess } = props;
  return (
    <>
      <DeleteButton
        onClick={() => {
          setShowModal(true);
        }}
      />
      {showModal && (
        <DeleteModal
          setShowModal={setShowModal}
          phase={phase}
          id={id}
          name={name}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
