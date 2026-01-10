import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction } from 'react';

import { del } from '@api/api_methods';

import { CloseButton, Modal, OutlinePrimaryButton, PrimaryButton } from '../common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  id: number | string;
}

const DeleteModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const deletePurchaseOrder = async (id: number | string) => {
    const deletePurchaseReportUrl = process.env.CSR_API_URI + '/purchaseorders/' + id;
    await del(deletePurchaseReportUrl);
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit text-xl text-black-600'>購入申請の削除</div>
      <div className='mx-auto my-5 w-fit text-xl'>削除しますか？</div>
      <div>
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton onClick={closeModal}>戻る</OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              deletePurchaseOrder(props.id);
              closeModal();
              router.reload();
            }}
          >
            削除
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
