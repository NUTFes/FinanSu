import React, { useState } from 'react';

import OpenAddModal from './AddModal';
import { AddButton } from '@components/common';

interface Props {
  children?: React.ReactNode;
}

export const OpenAddModalButton = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <AddButton
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {props.children}
      </AddButton>
      {isOpen && <OpenAddModal setShowModal={setIsOpen} />}
    </>
  );
};

export default OpenAddModalButton;
