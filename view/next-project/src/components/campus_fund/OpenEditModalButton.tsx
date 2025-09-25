import clsx from 'clsx';
import * as React from 'react';
import { useState } from 'react';

import { AddButton } from '../common';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const OpenEditModalButton = (props: Props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AddButton
        className={clsx(props.className)}
        onClick={() => {
          setShowModal(true);
        }}
      >
        {props.children}
      </AddButton>
    </>
  );
};

export default OpenEditModalButton;
