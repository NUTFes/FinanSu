import React, { useState } from 'react';

import PurchaseItemNumModal from './PurchaseItemNumModal';
import { AddButton } from '@components/common';
import { Expense, YearPeriod } from '@type/common';

interface Props {
  children?: React.ReactNode;
  expenses: Expense[];
  yearPeriods: YearPeriod[];
  selectedyear: string;
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
      {isOpen && <PurchaseItemNumModal setIsOpen={setIsOpen} expenses={props.expenses} yearPeriods={props.yearPeriods} selectedYear={props.selectedyear}/>}
    </>
  );
}
