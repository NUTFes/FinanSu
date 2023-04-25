import React, { useState } from 'react';

import AddButton from '../common/AddButton';
import SponsorActivitiesAddModal from './SponsorActivitiesAddModal';
import { User, Sponsor, SponsorStyle } from '@type/common';

interface Props {
  users: User[];
  sponsors: Sponsor[];
  sponsorStyles: SponsorStyle[];
  children: React.ReactNode;
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
        <SponsorActivitiesAddModal
          users={props.users}
          sponsors={props.sponsors}
          sponsorStyles={props.sponsorStyles}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
}
