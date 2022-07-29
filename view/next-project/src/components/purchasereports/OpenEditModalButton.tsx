import * as React from 'react';
import EditModal from '@components/purchasereports/EditModal';
import { useState } from 'react';
import { EditButton } from '@components/common';

interface Props {
  children?: React.ReactNode;
  id: number;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <EditButton onClick={onOpen} />
      {
        isOpen ? (
          <EditModal purchaseReportId={props.id} isOpen={isOpen} setIsOpen={setIsOpen} />
        ) : null}
    </>
  );
};

export default OpenEditModalButton;