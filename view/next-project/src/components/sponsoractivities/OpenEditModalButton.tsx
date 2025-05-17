import * as React from 'react';
import { useState } from 'react';

import {
  SponsorActivity,
  SponsorStyle,
  Sponsor,
  User,
  SponsorStyleDetail,
  ActivityStyle,
  YearPeriod,
} from '@/type/common';

import { EditButton } from '../common';
import EditModal from './EditModal';

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
  year: string;
  yearPeriods: YearPeriod[];
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  const sponsorStyleDetails = props.sponsorStyleDetails
    ? props.sponsorStyleDetails.map((sponsorStyleDetail) => {
        return sponsorStyleDetail.activityStyle;
      })
    : null;
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
          year={props.year}
          yearPeriods={props.yearPeriods}
        />
      )}
    </>
  );
};

export default OpenEditModalButton;
