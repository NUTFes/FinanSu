import React, { useState } from 'react';

import { YearPeriod } from '@/type/common';
import { AddButton } from '@components/common';

import OpenAddModal from './AddModal';

interface Props {
  children?: React.ReactNode;
  yearPeriods?: YearPeriod[];
}

export const OpenAddModalButton = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <AddButton
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {props.children}
      </AddButton>
      {isOpen && <OpenAddModal setShowModal={setIsOpen} yearPeriods={props.yearPeriods} />}
    </>
  );
};

export default OpenAddModalButton;
