import * as React from 'react';
import { useState } from 'react';

import EditModal from '@components/users/EditModal';
import { Bureau, User } from '@type/common';
import { EditButton } from '../common';

interface Props {
  id: number;
  bureaus: Bureau[];
  isDisabled?: boolean;
  user: User;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <EditButton onClick={() => setShowModal(true)} isDisabled={props.isDisabled || false} />
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
