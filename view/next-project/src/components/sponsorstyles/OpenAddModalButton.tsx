import React, { useState } from 'react';

import SponsorStyleAddModal from './SponsorStyleAddModal';
import { AddButton } from '@components/common';

export interface Props {
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
      {isOpen && <SponsorStyleAddModal setIsOpen={setIsOpen} />}
    </>
  );
};

export default OpenAddModalButton;
