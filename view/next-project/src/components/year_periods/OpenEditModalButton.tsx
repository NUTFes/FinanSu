import React, { useState } from 'react';

import EditModal from './EditModal';
import { EditButton } from '@components/common';
import { YearPeriods } from '@type/common';

interface Props {
  yearPeriod: YearPeriods;
  isDisabled?: boolean;
}

export const OpenEditModalButton = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <EditButton
        onClick={() => {
          setIsOpen(true);
        }}
        isDisabled={props.isDisabled}
      />
      {isOpen && <EditModal setShowModal={setIsOpen} yearPeriod={props.yearPeriod} />}
    </>
  );
};

export default OpenEditModalButton;
