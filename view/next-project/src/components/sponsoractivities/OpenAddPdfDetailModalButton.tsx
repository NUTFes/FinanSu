import * as React from 'react';
import { useState } from 'react';

import { SponsorActivityView } from '@/type/common';

import { PrimaryButton } from '../common';
import AddPdfDetailModal from './AddPdfDetailModal';

interface Props {
  children?: React.ReactNode;
  sponsorActivitiesViewItem: SponsorActivityView;
  setIsOpen: (isOpen: boolean) => void;
}

const OpenAddPdfDetailModalButton: React.FC<Props> = (props) => {
  const [isAddPdfDetailModalOpen, setIsAddPdfDetailModalOpen] = useState(false);
  const onOpen = () => {
    setIsAddPdfDetailModalOpen(true);
  };

  return (
    <>
      <PrimaryButton onClick={onOpen}>請求書作成</PrimaryButton>
      {isAddPdfDetailModalOpen && (
        <AddPdfDetailModal
          setIsOpen={setIsAddPdfDetailModalOpen}
          sponsorActivitiesViewItem={props.sponsorActivitiesViewItem}
        />
      )}
    </>
  );
};

export default OpenAddPdfDetailModalButton;
