import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { get, get_with_token } from '@api/api_methods';
import { post } from '@api/purchaseOrder';
import AddModal from '@components/purchaseorders/PurchaseOrderAddModal';
import { Modal, Input, Select, PrimaryButton, CloseButton } from '@components/common';
import { useUI } from '@components/ui/context';
import { useGlobalContext } from '@components/global/context';

export default function PurchaseItemNumModal() {
  const state = useGlobalContext();
  const router = useRouter();
  const { setModalView, openModal, closeModal } = useUI();

  // 局（Bureau）をフロントで定義
  const bureaus = [
    {
      id: 1,
      name: '総務局',
    },
    {
      id: 2,
      name: '渉外局',
    },
    {
      id: 3,
      name: '財務局',
    },
    {
      id: 4,
      name: '企画局',
    },
    {
      id: 5,
      name: '制作局',
    },
    {
      id: 6,
      name: '情報局',
    },
  ];

  const [bureauID, setBureauID] = useState<number>(state.user.bureau_id)

  // 申請する局用のhandler
  const bureauHandler = () => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBureauID(Number(e.target.value));
  };

  return (
    <Modal>
      <div className={clsx('w-full')}>
        <div className={clsx('mr-5 w-full grid justify-items-end')}>
          <CloseButton onClick={closeModal} />
        </div>
      </div>
      <div className={clsx('grid justify-items-center w-full mb-10 text-black-600 text-xl')}>
        購入報告の登録
      </div>
      <div className={clsx('grid grid-cols-12 gap-4 mb-10')}>
        <div className={clsx('grid col-span-1')} />
        <div className={clsx('grid col-span-10')}>
          <div className={clsx('w-full my-2')}>
            <div
              className={clsx(
                'grid justify-items-end text-center text-black-600 text-md',
              )}
            >
              申請した物品としていない物品を同時に購入した場合は<br />
              2回に分けて登録をお願いします。
            </div>
          </div>
          <div className={clsx('grid grid-cols-12 w-full mt-5')}>
            <div className={clsx('grid col-span-2 h-100')} />
            <div className={clsx('grid col-span-4 justify-items-end flex items-center text-right w-full text-black-600 text-md pr-3 h-100')}>
              申請する局
            </div>
            <div className={clsx('grid col-span-4 justify-items-end text-right w-full text-black-600 text-md mr-2 h-100')}>
              <Select
                value={bureauID}
                onChange={bureauHandler()}
              >
                {bureaus.map((data) => (
                  <option key={data.id} value={data.id}>{data.name}</option>
                ))}
              </Select>
            </div>
            <div className={clsx('grid col-span-2 h-100')} />
          </div>
        </div>
        <div className={clsx('grid col-span-1 ')} />
      </div>
      <div className={clsx('grid grid-cols-12 w-full pb-5')}>
        <div className={clsx('grid col-span-1 h-100')} />
        <div className={clsx('grid col-span-10 justify-items-center w-full text-black-600 text-md pr-3 h-100')}>
          <div className={clsx('flex')}>
            <div className={clsx('mx-2')}>
              <PrimaryButton
                onClick={() => {
                  setModalView('PURCHASE_REPORT_ADD_MODAL');
                  openModal();
                }}
              >
                購入申請から登録
              </PrimaryButton>
            </div>
            <div className={clsx('mx-2')}>
              <PrimaryButton
                onClick={() => {
                  setModalView('PURCHASE_REPORT_ADD_MODAL');
                  openModal();
                }}
              >
                単体で登録
              </PrimaryButton>
            </div>
          </div>
        </div>
        <div className={clsx('grid col-span-1 h-100')} />
      </div>
      <div className={clsx('grid justify-items-center px-1')}>
      </div>
    </Modal>
  );
}
