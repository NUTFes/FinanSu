import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '../common';
import EditModal from '@components/users/EditModal';
import { Bureau, User } from '@type/common';

interface Props {
  id: number;
  bureaus: Bureau[];
  user: User;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <EditButton onClick={() => setShowModal(true)} />
      {showModal && (
        <EditModal
          id={props.id}
          bureaus={props.bureaus}
          setShowModal={setShowModal}
          user={props.user}
        />
      )}
    </>
  );
};

export default OpenEditModalButton;
