import clsx from 'clsx';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import { BUREAUS } from '@/constants/bureaus';
import { userAtom } from '@/store/atoms';
import { CloseButton, Modal, PrimaryButton, PullDown } from '@components/common';
import { useUI } from '@components/ui/context';

export default function PurchaseItemNumModal() {
  const { setModalView, openModal, closeModal } = useUI();

  return (
    <Modal className='w-1/2'>
      <div className='w-fit ml-auto'>
        <CloseButton onClick={closeModal} />
      </div>
      <p className='mb-10 w-fit mx-auto text-xl text-black-600'>
        購入報告の登録
      </p>
      <div className='flex flex-col gap-2 items-center mb-10 text-black-600'>
        <p>申請した物品としていない物品を同時に購入した場合は</p>
        <p>2回に分けて登録をお願いします</p>
      </div>
      <div className='flex gap-5 justify-center'>
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
