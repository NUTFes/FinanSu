import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '@components/common';
import EditModal from '@components/purchasereports/EditModal';

interface Props {
  children?: React.ReactNode;
  id: number;
  isDisabled: boolean;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <EditButton onClick={onOpen} isDisabled={props.isDisabled} />
      {isOpen && (
        <EditModal purchaseReportId={props.id} isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </>
  );
};

export default OpenEditModalButton;
