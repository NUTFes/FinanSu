import AddButton  from '../common/AddButton';
import { useUI } from '../ui/context';
import React from 'react';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function OpenModalButton(props: Props) {
  const { setModalView, openModal } = useUI();

  return (
    <AddButton
      onClick={() => {
        setModalView('SPONSOR_ACTIVITIES_ADD_MODAL');
        openModal();
      }}
    >
      {props.children}
    </AddButton>
  );
}
