import { useState } from 'react';

import { SponsorshipActivity } from '@/generated/model';
import { EditButton } from '@components/common';
import { Sponsor, SponsorStyle, User, YearPeriod } from '@type/common';

import EditModal from './EditModal';

interface Props {
  id: number | string;
  sponsorshipActivity: SponsorshipActivity;
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  yearPeriods: YearPeriod[];
  isDisabled?: boolean;
  onSaved?: () => Promise<void> | void;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <EditButton onClick={() => setIsOpen(true)} isDisabled={props.isDisabled} />
      {isOpen && (
        <EditModal
          sponsorshipActivityId={props.id}
          sponsorshipActivity={props.sponsorshipActivity}
          sponsorStyles={props.sponsorStyles}
          sponsors={props.sponsors}
          users={props.users}
          yearPeriods={props.yearPeriods}
          setIsOpen={setIsOpen}
          onSaved={props.onSaved}
        />
      )}
    </>
  );
};

export default OpenEditModalButton;
