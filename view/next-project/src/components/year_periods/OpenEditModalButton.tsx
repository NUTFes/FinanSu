import React, { useState } from 'react';

import EditModal from './EditModal';
import { EditButton } from '@components/common';
import { YearRecords } from '@type/common';

interface Props {
  yearRecords: YearRecords;
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
      {isOpen && <EditModal setShowModal={setIsOpen} yearRecords={props.yearRecords} />}
    </>
  );
};

export default OpenEditModalButton;
