import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';

import { del } from '@api/api_methods';
import { Modal, PrimaryButton, CloseButton, OutlinePrimaryButton } from '@components/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  id: number | string;
}

export default function DeleteModal(props: ModalProps) {
  const router = useRouter();
  const closeModal = () => {
    props.setShowModal(false);
    router.reload();
  };

  const deleteTeacher = async () => {
    const deleteURL = process.env.CSR_API_URI + '/teachers/' + props.id;
    await del(deleteURL);
  };

  return (
    <Modal className='w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit text-xl text-black-600'>教員データの削除</div>
      <div className='mx-auto my-5 w-fit text-xl'>削除しますか？</div>
      <div className=''>
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton onClick={closeModal}>戻る</OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              deleteTeacher();
              closeModal();
            }}
          >
            削除
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
