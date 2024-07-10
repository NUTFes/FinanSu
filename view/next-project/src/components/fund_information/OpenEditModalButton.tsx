import React, { useState } from 'react';

import EditModal from './EditModal';
import { EditButton } from '@components/common';
import { Teacher, Department, User, FundInformation } from '@type/common';

interface Props {
  teachers: Teacher[];
  departments: Department[];
  users: User[];
  fundInformation: FundInformation;
  isDisabled: boolean;
  currentYear: string;
}

export const OpenAddModalButton = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <EditButton
        onClick={() => {
          setIsOpen(true);
        }}
        isDisabled={props.isDisabled}
      />
      {isOpen && (
        <EditModal
          setShowModal={setIsOpen}
          teachers={props.teachers}
          departments={props.departments}
          users={props.users}
          fundInformation={props.fundInformation}
          currentYear={props.currentYear}
        />
      )}
    </>
  );
};

export default OpenAddModalButton;
