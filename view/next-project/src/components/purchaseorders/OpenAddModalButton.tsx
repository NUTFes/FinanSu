import React, { useState } from 'react';

import PurchaseItemNumModal from './PurchaseItemNumModal';
import { AddButton } from '@components/common';
import { Expense, Source } from '@type/common';

interface Props {
  children?: React.ReactNode;
  expenses: Expense[];
  sources: Source[];
}

export default function OpenModalButton(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AddButton
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {props.children}
      </AddButton>
      {isOpen && (
        <PurchaseItemNumModal
          setIsOpen={setIsOpen}
          expenses={props.expenses}
          sources={props.sources}
        />
      )}
    </>
  );
}
