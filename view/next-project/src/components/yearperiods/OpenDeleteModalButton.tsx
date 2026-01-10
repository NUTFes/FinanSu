import React, { useState } from 'react';

import { YearPeriod } from '@/type/common';
import { DeleteButton } from '@components/common';

import DeleteModal from './DeleteModal';

interface Props {
  children?: React.ReactNode;
  id: number;
  isDisabled: boolean;
  yearPeriod: YearPeriod;
}

const OpenDeleteModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <DeleteButton onClick={onOpen} isDisabled={props.isDisabled} />
      {isOpen && (
        <DeleteModal id={props.id} setShowModal={setIsOpen} yearPeriod={props.yearPeriod} />
      )}
    </>
  );
};

export default OpenDeleteModalButton;
