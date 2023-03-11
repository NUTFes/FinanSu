import React from 'react';

import { AddButton } from '@components/common';
import { useUI } from '@components/ui/context';

interface Props {
  children?: React.ReactNode;
}

export const OpenAddModalButton = (props: Props) => {
  const { setModalView, openModal } = useUI();

  return (
    <AddButton
      onClick={() => {
        setModalView('SPONSOR_STYLE_NUM_MODAL');
        openModal();
      }}
    >
      {props.children}
    </AddButton>
  );
}

export default OpenAddModalButton;
