import React, { useState } from 'react';

import EditModal from './EditModal';
import { EditButton } from '@components/common';
import { YearPeriod } from '@type/common';

interface Props {
  yearPeriod: YearPeriod;
  isDisabled?: boolean;
  yearPeriods: YearPeriod[];
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
      {isOpen && (
        <EditModal
          setShowModal={setIsOpen}
          yearPeriod={props.yearPeriod}
          yearPeriods={props.yearPeriods}
        />
      )}
    </>
  );
};

export default OpenEditModalButton;
