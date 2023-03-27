import { del } from '@api/api_methods';
import { Modal, CloseButton, OutlinePrimaryButton, PrimaryButton } from '@components/common';
import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction } from 'react';

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

  const deleteSponsorActivity = async () => {
    const deleteSponsorActivityUrl = process.env.CSR_API_URI + '/activities/' + props.id;
    await del(deleteSponsorActivityUrl);
  };

  return (
    <Modal className='w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit text-xl text-black-600'>協賛企業の削除</div>
      <div className='mx-auto my-5 w-fit text-xl'>削除しますか？</div>
      <div className=''>
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton onClick={closeModal}>戻る</OutlinePrimaryButton>
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
