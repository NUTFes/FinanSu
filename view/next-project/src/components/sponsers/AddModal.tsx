import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { post } from '@api/purchaseItem';
import { PrimaryButton, CloseButton, Input, Modal } from '@components/common';
import { Sponser } from '@type/common';
import { useUI } from '@components/ui/context';

export default function AddModal() {
  const router = useRouter();
  const { closeModal } = useUI();

  const [formData, setFormData] = useState<Sponser>({
    name: '',
    tel: 0,
    email: '',
    address: '',
    representative: '',
  });

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  // const addPurchaseItem = async (data: Sponser[]) => {
  //   const addPurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems';
  //   data.map(async (item) => {
  //     await post(addPurchaseItemUrl, item);
  //   });
  // };

  const submit = async (formData: Sponser) => {
    // addPurchaseItem(formData);
    router.reload();
  };

  return (
    <>
      <Modal className='!w-1/2'>
        <div className={clsx('w-full')}>
          <div className={clsx('mr-5 grid w-full justify-items-end')}>
            <CloseButton onClick={closeModal} />
          </div>
        </div>
        <div className={clsx('mb-10 grid w-full justify-items-center text-xl text-black-600')}>
          購入物品の登録
        </div>
        <div className={clsx('my-6 grid grid-cols-12 gap-4')}>
          <div className={clsx('col-span-2 mr-2 grid')}>
            <div
              className={clsx('text-md flex grid items-center justify-items-end text-black-600')}
            >
              企業名
            </div>
          </div>
          <div className={clsx('col-span-10 grid w-full')}>
            <Input value={formData.name} onChange={handler('name')} />
          </div>
          <div className={clsx('col-span-2 mr-2 grid')}>
            <div
              className={clsx('text-md flex grid items-center justify-items-end text-black-600')}
            >
              単価
            </div>
          </div>
          <div className={clsx('col-span-10 grid w-full')}>
            {/* <Input value={data.price} onChange={handler(index, 'price')} /> */}
          </div>
          <div className={clsx('col-span-2 mr-2 grid')}>
            <div
              className={clsx('text-md flex grid items-center justify-items-end text-black-600')}
            >
              個数
            </div>
          </div>
          <div className={clsx('col-span-10 grid w-full')}>
            {/* <Input value={data.quantity} onChange={handler(index, 'quantity')} /> */}
          </div>
          <div className={clsx('col-span-2 mr-2 grid')}>
            <div
              className={clsx('text-md flex grid items-center justify-items-end text-black-600')}
            >
              詳細
            </div>
          </div>
          <div className={clsx('col-span-10 grid w-full')}>
            {/* <Input value={data.detail} onChange={handler(index, 'detail')} /> */}
          </div>
          <div className={clsx('col-span-2 mr-2 grid')}>
            <div
              className={clsx('text-md flex grid items-center justify-items-end text-black-600')}
            >
              URL
            </div>
          </div>
          <div className={clsx('col-span-10 grid w-full')}>
            {/* <Input value={data.url} onChange={handler(index, 'url')} /> */}
          </div>
        </div>
        <PrimaryButton onClick={() => {}}>登録する</PrimaryButton>
      </Modal>
    </>
  );
}
