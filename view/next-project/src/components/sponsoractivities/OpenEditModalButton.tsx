import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '../common';
import EditModal from './EditModal';
import { SponsorActivity, SponsorStyle, Sponsor, User, SponsorStyleDetail, ActivityStyle } from '@/type/common';

interface Props {
  children?: React.ReactNode;
  id: number | string;
  sponsorActivity: SponsorActivity;
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  isDisabled?: boolean;
  sponsorStyleDetails: SponsorStyleDetail[];
  activityStyles: ActivityStyle[];
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  const sponsorStyleDetails = props.sponsorStyleDetails.map((sponsorStyleDetail) => {
    return sponsorStyleDetail.activityStyle;
  });
  return (
    <>
      <EditButton onClick={onOpen} isDisabled={props.isDisabled} />
      {isOpen && (
        <EditModal
          sponsorActivityId={props.id}
          sponsorActivity={props.sponsorActivity}
          sponsorStyles={props.sponsorStyles}
          sponsors={props.sponsors}
          users={props.users}
          setIsOpen={setIsOpen}
          sponsorStyleDetails={sponsorStyleDetails}
          activityStyles={props.activityStyles}
        />
      )}
    </>
  );
};

export default OpenEditModalButton;
