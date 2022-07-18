import React, { useState } from 'react';
import PurchaseItemNumModal from '@components/purchaseorders/PurchaseItemNumModal';
import { AddButton } from '@components/common';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function OpenModalButton(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <AddButton onClick={onOpen}>{props.children}</AddButton>
      {isOpen ? <PurchaseItemNumModal isOpen={isOpen} onClose={onClose} /> : null}
    </>
  );
}
