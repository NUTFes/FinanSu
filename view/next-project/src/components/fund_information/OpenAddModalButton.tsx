import React, { useState } from 'react';

import OpenAddModal from './AddModal';
import { AddButton } from '@components/common';
import { Teacher, Department, User } from '@type/common';

interface Props {
  children?: React.ReactNode;
  teachers: Teacher[];
  departments: Department[];
  users: User[];
  currentUser?: User;
}

export const OpenAddModalButton = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <AddButton
        className='fixed bottom-4 right-4 md:static md:bottom-auto md:right-auto md:z-auto'
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {props.children}
      </AddButton>
      {isOpen && (
        <OpenAddModal
          setShowModal={setIsOpen}
          teachers={props.teachers}
          departments={props.departments}
          users={props.users}
          currentUser={props.currentUser}
        />
      )}
    </>
  );
};

export default OpenAddModalButton;
