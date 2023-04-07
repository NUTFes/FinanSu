import React, { useState } from 'react';

import { EditButton } from '@components/common';
import EditModal from './EditModal';
import { Teacher, Department, User, FundInformation } from '@type/common';

interface Props {
  teachers: Teacher[];
  departments: Department[];
  users: User[];
  fundInformation: FundInformation;
}

export const OpenAddModalButton = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <EditButton
        onClick={() => {
          setIsOpen(true);
        }}
      />
      {isOpen && (
        <EditModal
          setShowModal={setIsOpen}
          teachers={props.teachers}
          departments={props.departments}
          users={props.users}
          fundInformation={props.fundInformation}
        />
      )}
    </>
  );
};

export default OpenAddModalButton;
