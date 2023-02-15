import clsx from 'clsx';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import { CloseButton, Modal, PrimaryButton, PullDown } from '@components/common';
import { useUI } from '@components/ui/context';

export default function PurchaseItemNumModal() {
  const [user] = useRecoilState(userAtom);

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

  const [bureauID, setBureauID] = useState<number>(user.bureauID);

  // 申請する局用のhandler
  const bureauHandler = () => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBureauID(Number(e.target.value));
  };

  return (
    <Modal>
      <div className={clsx('w-full')}>
        <div className={clsx('mr-5 grid w-full justify-items-end')}>
          <CloseButton onClick={closeModal} />
        </div>
      </div>
      <div className={clsx('mb-10 grid w-full justify-items-center text-xl text-black-600')}>
        購入報告の登録
      </div>
      <div className={clsx('mb-10 grid grid-cols-12 gap-4')}>
        <div className={clsx('col-span-1 grid')} />
        <div className={clsx('col-span-10 grid')}>
          <div className={clsx('my-2 w-full')}>
            <div className={clsx('text-md grid justify-items-end text-center text-black-600')}>
              申請した物品としていない物品を同時に購入した場合は
              <br />
              2回に分けて登録をお願いします。
            </div>
          </div>
          <div className={clsx('mt-5 grid w-full grid-cols-12')}>
            <div className={clsx('h-100 col-span-2 grid')} />
            <div
              className={clsx(
                'text-md h-100 col-span-4 flex grid w-full items-center justify-items-end pr-3 text-right text-black-600',
              )}
            >
              申請する局
            </div>
            <div
              className={clsx(
                'text-md h-100 col-span-4 mr-2 grid w-full justify-items-start text-right font-bold text-black-600',
              )}
            >
              <PullDown value={bureauID} onChange={bureauHandler()}>
                {bureaus.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </PullDown>
            </div>
            <div className={clsx('h-100 col-span-2 grid')} />
          </div>
        </div>
        <div className={clsx('col-span-1 grid ')} />
      </div>
      <div className={clsx('grid w-full grid-cols-12 pb-5')}>
        <div className={clsx('h-100 col-span-1 grid')} />
        <div
          className={clsx(
            'text-md h-100 col-span-10 grid w-full justify-items-center pr-3 text-black-600',
          )}
        >
          <div className={clsx('flex')}>
            <div className={clsx('mx-2')}>
              <PrimaryButton
                onClick={() => {
                  setModalView('PURCHASE_ORDER_LIST_MODAL');
                  openModal();
                }}
              >
                購入申請から登録
              </PrimaryButton>
            </div>
            <div className={clsx('mx-2')}>
              <PrimaryButton
                onClick={() => {
                  setModalView('PURCHASE_REPORT_ITEM_NUM_MODAL');
                  openModal();
                }}
              >
                単体で登録
              </PrimaryButton>
            </div>
          </div>
        </div>
        <div className={clsx('h-100 col-span-1 grid')} />
      </div>
      <div className={clsx('grid justify-items-center px-1')}></div>
    </Modal>
  );
}
