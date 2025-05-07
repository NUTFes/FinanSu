import * as React from 'react';
import { useState } from 'react';

import { SponsorActivityView } from '@/type/common';

import { PrimaryButton } from '../common';
import PaymentDayModal from './PaymentDayModal';

interface Props {
  children?: React.ReactNode;
  sponsorActivitiesViewItem: SponsorActivityView;
  setIsOpen: (isOpen: boolean) => void;
}

const OpenPaymentDayModalButton: React.FC<Props> = (props) => {
  const [isPaymentDayModalOpen, setIsPaymentDayModalOpen] = useState(false);
  const onOpen = () => {
    setIsPaymentDayModalOpen(true);
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
