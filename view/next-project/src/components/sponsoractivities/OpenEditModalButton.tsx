import { EditButton } from '../common';
import EditModal from './EditModal';
import * as React from 'react';
import { useState } from 'react';


interface Props {
  children?: React.ReactNode;
  id: React.ReactNode;
  isDisabled: boolean;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <EditButton onClick={onOpen} isDisabled={props.isDisabled} />
      {isOpen ? (
        <EditModal purchaseReportId={props.id} isOpen={isOpen} setIsOpen={setIsOpen} />
      ) : null}
    </>
  );
};

export default OpenEditModalButton;
