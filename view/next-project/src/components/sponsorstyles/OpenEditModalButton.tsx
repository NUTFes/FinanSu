import * as React from 'react';
import { useState } from 'react';

import { EditButton } from '@components/common';
import EditModal from '@components/sponsorstyles/EditModal';
import { SponsorStyle } from '@type/common';

export interface Props {
  children?: React.ReactNode;
  id: number;
  sponsorStyle: SponsorStyle;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <EditButton onClick={onOpen} />
      {isOpen && (
        <EditModal
          sponsorStyleId={props.id}
          setIsOpen={setIsOpen}
          sponsorStyle={props.sponsorStyle}
        />
      )}
    </>
  );
};

export default OpenEditModalButton;
