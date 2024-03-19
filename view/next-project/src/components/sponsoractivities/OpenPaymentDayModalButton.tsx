import * as React from 'react';
import { useState } from 'react';

import { PrimaryButton } from '../common';
import PaymentDayModal from './PaymentDayModal';
import { SponsorActivityView } from '@/type/common';

interface Props {
  children?: React.ReactNode;
  sponsorActivitiesViewItem: SponsorActivityView;
  setIsOpen: (isOpen: boolean) => void;
  isDisabled?: boolean;
}

const OpenPaymentDayModalButton: React.FC<Props> = (props) => {
  const [isPaymentDayModalOpen, setIsPaymentDayModalOpen] = useState(false);
  const onOpen = () => {
    setIsPaymentDayModalOpen(true);
    // props.setIsOpen(false)
  };

  return (
    <>
      <PrimaryButton onClick={onOpen}>領収書作成</PrimaryButton>
      {isPaymentDayModalOpen && (
        <PaymentDayModal
          setIsOpen={setIsPaymentDayModalOpen}
          sponsorActivitiesViewItem={props.sponsorActivitiesViewItem}
        />
      )}
    </>
  );
};

export default OpenPaymentDayModalButton;
