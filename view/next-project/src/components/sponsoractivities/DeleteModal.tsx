import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction } from 'react';

import { del } from '@api/api_methods';
import { Modal, CloseButton, OutlinePrimaryButton, PrimaryButton } from '@components/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
  id: number | string;
}

const SponsorActivitiesDeleteModal: FC<ModalProps> = (props) => {
  const router = useRouter();

  const closeModal = () => {
    props.setShowModal(false);
    router.reload();
  };

  const onClose = () => {
    props.setShowModal(false);
  };

  const deleteSponsorActivity = async () => {
    const deleteSponsorActivityUrl = process.env.CSR_API_URI + '/activities/' + props.id;
    await del(deleteSponsorActivityUrl);
  };

  return (
    <Modal className='md:w-1/2' onClick={onClose}>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit text-xl text-black-600'>協賛企業の削除</div>
      <div className='mx-auto my-5 w-fit text-xl'>削除しますか？</div>
      <div className=''>
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton onClick={onClose}>戻る</OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              deleteSponsorActivity();
              closeModal();
            }}
          >
            削除
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default SponsorActivitiesDeleteModal;
