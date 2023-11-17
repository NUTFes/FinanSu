import React, { useState } from 'react';

import DeleteModal from './DeleteModal';
import { YearRecords } from '@/type/common';
import { DeleteButton } from '@components/common';

interface Props {
  children?: React.ReactNode;
  id: number;
  isDisabled: boolean;
  yearRecord: YearRecords;
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
        <DeleteModal id={props.id} setShowModal={setIsOpen} yearRecord={props.yearRecord} />
      )}
    </>
  );
};

export default OpenDeleteModalButton;
