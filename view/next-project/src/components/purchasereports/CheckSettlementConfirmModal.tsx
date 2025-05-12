import React, { Dispatch, FC, SetStateAction } from 'react';
import { Modal, CloseButton, OutlinePrimaryButton, PrimaryButton } from '@components/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  id: number;
  onConfirm: (id: number) => void;
}

const CheckSettlementConfirmModal: FC<ModalProps> = (props) => {
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
      <div className='mx-auto mb-5 w-fit text-xl text-black-600'>清算完了に変更</div>
      <div className='mx-auto my-5 w-fit text-center'>
        <p className='text-lg'>この購入報告を清算完了に変更しますか？</p>
        <p className='mt-5 text-sm text-red-600'>
          一度清算完了にすると、元に戻すことはできません。
        </p>
      </div>
      <div className=''>
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton onClick={closeModal}>キャンセル</OutlinePrimaryButton>
          <PrimaryButton onClick={handleConfirm}>変更する</PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default CheckSettlementConfirmModal;
