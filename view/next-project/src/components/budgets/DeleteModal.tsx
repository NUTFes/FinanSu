import { useRouter } from 'next/router';
import { FC, Dispatch, SetStateAction } from 'react';

import { del } from '@api/api_methods';

import { CloseButton, Modal, OutlinePrimaryButton, PrimaryButton } from '../common';

export interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
  id: number | string;
}

const BudgetDeleteModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const deleteBudget = async (id: number | string) => {
    const deleteBudgetUrl = process.env.CSR_API_URI + '/budgets/' + id;
    await del(deleteBudgetUrl);
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit text-xl text-black-600'>予算の削除</div>
      <div className='mx-auto my-5 w-fit text-xl'>削除しますか？</div>
      <div className='flex justify-center gap-4'>
        <OutlinePrimaryButton onClick={closeModal}>戻る</OutlinePrimaryButton>
        <PrimaryButton
          onClick={() => {
            deleteBudget(props.id);
            closeModal();
            router.reload();
          }}
        >
          削除
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default BudgetDeleteModal;
