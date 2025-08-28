import * as React from 'react';
import { useState } from 'react';

import { AddButton } from '../common';
import AddModal from '@components/divisions/AddModal';

const OpenAddModalButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AddButton onClick={() => setShowModal(true)} />
      {showModal && <AddModal setShowModal={setShowModal} />}
    </>
  );
};

export default OpenAddModalButton;
