import { AddButton } from '@components/common';
import { useUI } from '@components/ui/context';
import React from 'react';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function OpenAddModalButton(props: Props) {
  const { setModalView, openModal } = useUI();

  return (
    <>
      <AddButton
        onClick={() => {
          setModalView('SPONSOR_ADD_MODAL');
          openModal();
        }}
      >
        {props.children}
      </AddButton>
    </>
  );
}
