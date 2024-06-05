import React, { useState, useMemo } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import DeleteModal from '../users/DeleteModal';
import { User } from '@type/common';

interface Props {
  children?: React.ReactNode;
  deleteUsers?: { users: User[]; ids: number[] };
  isDisabled?: boolean;
}

const OpenDeleteModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };

  const buttonClass = useMemo(() => {
    if (props.isDisabled) {
      return 'cursor-default opacity-25';
    } else {
      return 'cursor-pointer hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500';
    }
  }, [props.isDisabled]);

  return (
    <>
      <button
        disabled={props.isDisabled}
        className={`${buttonClass} flex h-9 w-9 min-w-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 p-0`}
        onClick={onOpen}
        suppressHydrationWarning
      >
        <RiDeleteBinLine size={'20px'} color={'white'} />
      </button>
      {isOpen && <DeleteModal deleteUsers={props.deleteUsers} setShowModal={setIsOpen} />}
    </>
  );
};

export default OpenDeleteModalButton;
