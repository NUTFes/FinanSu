import * as React from 'react';
import { useState } from 'react';

import { DeleteButton } from '../common';
import DeleteModal from '@components/teacher/DeleteModal';
import { Teacher } from '@type/common';

interface Props {
  deleteTeachers?: {teachers: Teacher[]; ids: number[] };
  isDisabled: boolean;
}

const OpenDeleteModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);

  const ShowModal = () => {
    setShowModal(true);
  };

  // const buttonClass = useMemo(() => {
  //   if (props.isDisabled) {
  //     return 'cursor-default opacity-25';
  //   } else {
  //     return 'cursor-pointer hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500';
  //   }
  // }, [props.isDisabled]);

  return (
    <>
      <DeleteButton onClick={ShowModal} isDisabled={props.isDisabled} />
      {showModal && <DeleteModal deleteTeachers={props.deleteTeachers} setShowModal={setShowModal} />}
    </>
  );
};

export default OpenDeleteModalButton;
