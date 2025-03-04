import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { CloseButton, Modal, OutlinePrimaryButton, PrimaryButton } from '../common';
import { useDeleteBuyReportsId } from '@/generated/hooks';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  openModal: boolean;
  children?: React.ReactNode;
  id: number;
}

const PurchaseReportDeleteModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const { trigger } = useDeleteBuyReportsId(props.id);

  const deletePurchaseReport = async () => {
    await trigger();
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit text-xl text-black-600'>購入報告の削除</div>
      <div className='mx-auto my-5 w-fit text-xl'>削除しますか？</div>
      <div className=''>
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton onClick={closeModal}>戻る</OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              deletePurchaseReport();
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

export default PurchaseReportDeleteModal;
