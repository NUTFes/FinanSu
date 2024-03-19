import { clsx } from 'clsx';
import React, { FC, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { Modal } from '@components/common';
import { DESIGNERS } from '@constants/designers';
import { SponsorActivityView } from '@type/common';
import DetailPage1 from './DetailPage1';
import DetailPage2 from './DetailPage2';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  id: React.ReactNode;
  sponsorActivitiesViewItem: SponsorActivityView;
  isDelete: boolean;
}

const DetailModal: FC<ModalProps> = (props) => {
  const onClose = () => {
    props.setIsOpen(false);
  };
  const [pageNum, setPageNum] = useState<number>(1);

  const formatDate = (date: string) => {
    const datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 10);
    return datetime2;
  };

  return (
    <Modal className='md:h-6/12 md:mt-5 md:w-6/12'>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <RiCloseCircleLine size={'23px'} color={'gray'} onClick={onClose} />
        </div>
      </div>
      {pageNum === 1 && (
        <DetailPage1
          setPageNum={setPageNum}
          sponsorActivitiesViewItem={props.sponsorActivitiesViewItem}
          id={props.id}
        />
      )}
      {pageNum === 2 && (
        <DetailPage2
          setPageNum={setPageNum}
          sponsorActivitiesViewItem={props.sponsorActivitiesViewItem}
          id={props.id}
        />
      )}
    </Modal>
  );
};

export default DetailModal;
