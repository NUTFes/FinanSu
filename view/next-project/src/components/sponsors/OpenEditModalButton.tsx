import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '@components/common';
import { Sponsor } from '@type/common';

import SponsorEditModal from './SponsorEditModal';

interface Props {
  children?: React.ReactNode;
  sponsor: Sponsor;
  isDisabled?: boolean;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <EditButton onClick={onOpen} isDisabled={props.isDisabled} />
      {isOpen && <SponsorEditModal sponsor={props.sponsor} setIsOpen={setIsOpen} />}
    </>
  );
};

export default OpenEditModalButton;
