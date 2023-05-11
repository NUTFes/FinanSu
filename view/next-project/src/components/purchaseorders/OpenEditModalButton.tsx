import React, { useState } from 'react';

import { EditButton } from '@components/common';
import EditModal from '@components/purchaseorders/EditModal';
import { PurchaseItem, Source } from '@type/common';

interface Props {
  children?: React.ReactNode;
  purchaseItems: PurchaseItem[];
  id: number;
  isDisabled: boolean;
  sources: Source[];
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
        <EditModal
          purchaseOrderId={props.id}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          purchaseItems={props.purchaseItems}
          sources={props.sources}
        />
      )}
    </>
  );
};

export default OpenEditModalButton;
