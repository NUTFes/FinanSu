import React from 'react';
import { useState } from 'react';

import { DeleteButton } from '@components/common';
import DetailModal from '@components/purchaseorders/DetailModal';
import { PurchaseOrderView } from '@type/common';

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
      {isOpen && (
        <DetailModal
          id={props.id}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          purchaseOrderViewItem={props.purchaseOrderViewItem}
          isDelete={true}
        />
      )}
    </>
  );
};

export default OpenDeleteModalButton;
