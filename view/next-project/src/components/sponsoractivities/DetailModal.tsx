import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import DetailPage1 from './DetailPage1';
import DetailPage2 from './DetailPage2';
import { Modal } from '@components/common';
import { SponsorActivityView } from '@type/common';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  id: React.ReactNode;
  sponsorActivitiesViewItem: SponsorActivityView;
  isDelete: boolean;
}

const DetailModal: FC<ModalProps> = (props) => {
  const [isChange, setIsChange] = useState<boolean>(false);
  const [sponsorActivitiesView, setSponsorActivitiesView] = useState<SponsorActivityView>(
    props.sponsorActivitiesViewItem,
  );

  const router = useRouter();
  const onClose = () => {
    props.setIsOpen(false);
    isChange && router.reload();
  };
  const [pageNum, setPageNum] = useState<number>(1);

  return (
    <Modal className='md:h-6/12 md:mt-5 md:w-6/12'>
      <div className='ml-auto w-fit'>
        <RiCloseCircleLine size={'23px'} color={'gray'} onClick={onClose} />
      </div>
      {pageNum === 1 && (
        <DetailPage1
          setPageNum={setPageNum}
          sponsorActivitiesViewItem={sponsorActivitiesView}
          id={props.id}
          setIsOpen={props.setIsOpen}
        />
      )}
      {pageNum === 2 && (
        <DetailPage2
          setPageNum={setPageNum}
          sponsorActivitiesViewItem={sponsorActivitiesView}
          setSponsorActivitiesView={setSponsorActivitiesView}
          id={props.id}
          setIsChange={setIsChange}
        />
      )}
    </Modal>
  );
};

export default DetailModal;
