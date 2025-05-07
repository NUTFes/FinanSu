import * as React from 'react';
import { useState } from 'react';

import AddModal from '@components/budgets/AddModal';
import { Source, Year } from '@type/common';

import { AddButton } from '../common';

interface Props {
  children?: React.ReactNode;
  sources: Source[];
  years: Year[];
}

export default function OpenAddModalButton(props: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AddButton
        onClick={() => {
          setShowModal(true);
        }}
      >
        {props.children}
      </AddButton>
      {showModal && (
        <AddModal setShowModal={setShowModal} years={props.years} sources={props.sources} />
      )}
    </>
  );
}
