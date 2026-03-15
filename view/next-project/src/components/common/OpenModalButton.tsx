import * as React from 'react';
import { useState } from 'react';

import RegistModal from './RegistModal';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
}

const OpenModalButton: React.FC<Props> = ({ children, width, height }) => {
  const [showModal, setShowModal] = useState(false);
  const ShowModal = () => {
    setShowModal(true);
  };
  return (
    <>
      <button
        className='
          rounded-md bg-linear-to-br from-primary-1 to-primary-2 px-4 py-2
          text-white-0 transition-all
          hover:from-primary-2 hover:to-primary-1
        '
        style={{ height, width }}
        onClick={ShowModal}
      >
        {children}
      </button>
      <RegistModal openModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default OpenModalButton;
