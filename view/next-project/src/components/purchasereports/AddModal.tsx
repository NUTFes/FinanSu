import React from 'react';

import { CloseButton, Modal, PrimaryButton } from '@components/common';
import { useUI } from '@components/ui/context';

export default function PurchaseItemNumModal() {
  const { setModalView, openModal, closeModal } = useUI();

  return (
    <Modal className='w-1/2'>
      <div className='ml-auto w-fit'>
        <CloseButton onClick={closeModal} />
      </div>
      <p className='mx-auto mb-10 w-fit text-xl text-black-600'>購入報告の登録</p>
      <div className='mb-10 flex flex-col items-center gap-2 text-black-600'>
        <p>申請した物品としていない物品を同時に購入した場合は</p>
        <p>2回に分けて登録をお願いします</p>
      </div>
      <div className='flex justify-center gap-5'>
        <PrimaryButton
          onClick={() => {
            setModalView('PURCHASE_ORDER_LIST_MODAL');
            openModal();
          }}
        >
          購入申請から登録
        </PrimaryButton>
        <PrimaryButton
          onClick={() => {
            setModalView('PURCHASE_REPORT_ITEM_NUM_MODAL');
            openModal();
          }}
        >
          申請していない物品を登録
        </PrimaryButton>
      </div>
    </Modal>
  );
}
