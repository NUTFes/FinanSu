import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '../common';
import EditModal from './EditModal';
import { SponsorActivity } from '@/type/common';

interface Props {
  children?: React.ReactNode;
  id: number | string;
  sponsorActivity: SponsorActivity;
  isDisabled: boolean;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <EditButton onClick={onOpen} isDisabled={props.isDisabled} />
      {isOpen ? (
        <EditModal sponsorActivityId={props.id} sponsorActivity={props.sponsorActivity} setIsOpen={setIsOpen} />
      ) : null}
    </>
  );
};

export default OpenEditModalButton;
