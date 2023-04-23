import React, { useState } from 'react';

import DeleteModal from '../sponsoractivities/DeleteModal';
import { DeleteButton } from '@components/common';

interface Props {
  children?: React.ReactNode;
  id: number | string;
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
      {isOpen && <DeleteModal id={props.id} setShowModal={setIsOpen} />}
    </>
  );
};

export default OpenDeleteModalButton;
