import * as React from 'react';
import EditModal from '@components/purchaseorders/EditModal';
import { useState } from 'react';
import {EditButton} from '@components/common';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  id: number;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose= () => {
    setIsOpen(false);
  };
  return (
    <>
      <EditButton onClick={onOpen}>
        {props.children}
      </EditButton>
      {
      isOpen ? (
        <EditModal id={props.id} openModal={isOpen} setShowModal={setIsOpen} />
      ) : null}
    </>
  );
};

export default OpenEditModalButton;
