import { useState } from 'react';

import { Sponsor, SponsorStyle, User, YearPeriod } from '@type/common';

import SponsorActivitiesAddModal from './SponsorActivitiesAddModal';
import AddButton from '../common/AddButton';

interface Props {
  users: User[];
  sponsors: Sponsor[];
  sponsorStyles: SponsorStyle[];
  yearPeriods: YearPeriod[];
  children?: React.ReactNode;
  onSaved?: () => Promise<void> | void;
}

export default function OpenAddModalButton(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AddButton
        className='
          fixed right-4 bottom-4
          md:static md:right-auto md:bottom-auto md:z-auto
        '
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {props.children}
      </AddButton>
      {isOpen && (
        <SponsorActivitiesAddModal
          users={props.users}
          sponsors={props.sponsors}
          sponsorStyles={props.sponsorStyles}
          setIsOpen={setIsOpen}
          yearPeriods={props.yearPeriods}
          onSaved={props.onSaved}
        />
      )}
    </>
  );
}
