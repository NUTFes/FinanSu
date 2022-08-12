import React from 'react';
import DetailModal from '@components/purchaseorders/DetailModal';
import { useState } from 'react';
import { DeleteButton } from '@components/common';
import { PurchaseOrderView } from '@pages/purchaseorders'

interface Props {
  children?: React.ReactNode;
  id: number;
  purchaseOrderViewItem: PurchaseOrderView;
  isDisabled: boolean;
}

const OpenDeleteModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <DeleteButton onClick={onOpen} isDisabled={props.isDisabled} />
      {
      isOpen ? (
        <DetailModal id={props.id} isOpen={isOpen} setIsOpen={setIsOpen} purchaseOrderViewItem={props.purchaseOrderViewItem} isDelete={true} />
      ) : null}
    </>
  );
};

export default OpenDeleteModalButton;
