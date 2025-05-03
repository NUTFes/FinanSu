import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction } from 'react';

import { YearPeriod } from '@/type/common';
import { del } from '@api/api_methods';
import { Modal, CloseButton, OutlinePrimaryButton, PrimaryButton } from '@components/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
  id: number | string;
  yearPeriod: YearPeriod;
}

const DeleteModal: FC<ModalProps> = (props) => {
  const router = useRouter();

  const closeModal = () => {
    props.setShowModal(false);
    router.reload();
  };

  const deleteYearPeriod = async (id: number | string) => {
    const deleteYearPeriodUrl = process.env.CSR_API_URI + '/years/periods/' + id;
    await del(deleteYearPeriodUrl);
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit text-xl text-black-600'>年度の削除</div>
      <div className='mx-auto my-5 w-fit text-xl text-black-600'>{props.yearPeriod.year}年度</div>
      <div className='mx-auto my-5 w-fit text-xl'>削除しますか？</div>
      <div className=''>
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton onClick={closeModal}>戻る</OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              deleteYearPeriod(props.id);
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

export default DeleteModal;
