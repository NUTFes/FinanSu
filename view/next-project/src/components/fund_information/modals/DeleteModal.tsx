import React, { Dispatch, FC, SetStateAction } from 'react';

import { Modal, CloseButton, OutlinePrimaryButton, PrimaryButton } from '@components/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
  id: number;
  onConfirm: (id: number) => void;
}

const DeleteConfirmModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const handleConfirm = () => {
    props.onConfirm(props.id);
    closeModal();
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={closeModal} />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit text-xl text-black-600'>項目の削除</div>
      <div className='mx-auto my-5 w-fit text-center'>
        <p className='text-lg'>この収支項目を削除しますか？</p>
        <p className='mt-2 text-sm text-red-600'>この操作は取り消せません。</p>
      </div>
      <div className=''>
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton onClick={closeModal}>キャンセル</OutlinePrimaryButton>
          <PrimaryButton onClick={handleConfirm}>削除する</PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
