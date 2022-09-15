import React, { useState } from 'react';
import { AddButton } from '@components/common';
import { useUI } from '@components/ui/context';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function OpenModalButton(props: Props) {
  const { setModalView, openModal } = useUI();

  return (
    <>
      <AddButton
        onClick={() => {
          setModalView('PURCHASE_ITEM_NUM_MODAL');
          openModal();
        }}
      >
        {props.children}
      </AddButton>
    </>
  );
}
