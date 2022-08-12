import React, { useState } from 'react';
import EditModal from '@components/purchaseorders/EditModal';
import { EditButton } from '@components/common';
import { PurchaseItem } from '@pages/purchaseorders'

interface Props {
  children?: React.ReactNode;
  purchaseItems: PurchaseItem[];
  id: number;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <EditButton onClick={onOpen}/>
      {
      isOpen ? (
        <EditModal purchaseOrderId={props.id} isOpen={isOpen} setIsOpen={setIsOpen} purchaseItems={props.purchaseItems} />
      ) : null}
    </>
  );
};

export default OpenEditModalButton;
