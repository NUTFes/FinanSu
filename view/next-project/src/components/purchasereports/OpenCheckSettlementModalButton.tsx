import { useState } from 'react';
import CheckSettlementConfirmModal from './CheckSettlementConfirmModal';
import { Checkbox } from '@components/common';

interface Props {
  id: number;
  isChecked: boolean;
  onConfirm: (id: number) => void;
  disabled?: boolean;
}

const OpenCheckSettlementModalButton = ({ id, isChecked, onConfirm, disabled }: Props) => {
  const [showModal, setShowModal] = useState(false);

  const handleChange = () => {
    if (!isChecked) {
      setShowModal(true);
    } else {
      onConfirm(id);
    }
  };

  return (
    <>
      <Checkbox
        className='accent-primary-5'
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
      />

      {showModal && (
        <CheckSettlementConfirmModal setShowModal={setShowModal} id={id} onConfirm={onConfirm} />
      )}
    </>
  );
};

export default OpenCheckSettlementModalButton;
