import React, { useState } from 'react';

import {
  CloseButton,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  PullDown,
} from '@components/common';
import { useUI } from '@components/ui/context';

import SponsorStyleAddModal from './SponsorStyleAddModal';

export default function SponsorStyleNumModal() {
  const { closeModal } = useUI();

  // 協賛スタイル数用の配列
  const sponsorStyleNumArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // 協賛スタイルの追加モーダル開閉用変数
  const [isOpen, setIsOpen] = useState(false);

  // 購入物品数
  const [purchaseItemNum, setPurchaseItemNum] = useState<number>(1);

  return (
    <Modal>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={closeModal} />
        </div>
      </div>
      <div className='mt-3 mb-8 mx-auto w-fit'>
        <p className='text-xl text-black-600'> 協賛スタイルの登録</p>
      </div>
      <div className='flex flex-col gap-8 items-center'>
        <div className='flex flex-col gap-2 items-center'>
          <p className='text-md flex items-center text-black-600'>複数同時に登録できます</p>
          <p className='text-md flex items-center text-black-600'>いくつ登録しますか？</p>
        </div>
        <div className='w-3/4 flex flex-row gap-3 items-center'>
          <p className='w-1/2 text-md text-black-600'>登録数</p>
          <PullDown
            value={purchaseItemNum}
            onChange={(e) => setPurchaseItemNum(Number(e.target.value))}
          >
            {sponsorStyleNumArray.map((data) => (
              <option key={data} value={data}>
                {data}
              </option>
            ))}
          </PullDown>
        </div>
        <div className='flex'>
          <div className='mx-2'>
            <OutlinePrimaryButton onClick={closeModal}>戻る</OutlinePrimaryButton>
          </div>
          <div className='mx-2'>
            <PrimaryButton
              onClick={() => {
                setIsOpen(true);
              }}
            >
              報告へ進む
            </PrimaryButton>
            {isOpen && (
              <SponsorStyleAddModal
                purchaseItemNum={purchaseItemNum}
                setIsOpen={setIsOpen}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
