/* eslint-disable import/no-unresolved */
import { post } from '@api/sponser';
import { PrimaryButton, CloseButton, Input, Modal } from '@components/common';
import { useUI } from '@components/ui/context';
import { Sponser } from '@type/common';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

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

  const addSponserItem = async (data: Sponser) => {
    const addPurchaseItemUrl = process.env.CSR_API_URI + '/sponsers';
    await post(addPurchaseItemUrl, data);
  };

  const submit = async (formData: Sponser) => {
    addSponserItem(formData);
    closeModal();
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
          企業登録
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
              電話番号
            </div>
          </div>
          <div className={clsx('col-span-10 grid w-full')}>
            <Input value={formData.tel} onChange={handler('tel')} />
          </div>
          <div className={clsx('col-span-2 mr-2 grid')}>
            <div
              className={clsx('text-md flex grid items-center justify-items-end text-black-600')}
            >
              メール
            </div>
          </div>
          <div className={clsx('col-span-10 grid w-full')}>
            <Input value={formData.email} onChange={handler('email')} />
          </div>
          <div className={clsx('col-span-2 mr-2 grid')}>
            <div
              className={clsx('text-md flex grid items-center justify-items-end text-black-600')}
            >
              住所
            </div>
          </div>
          <div className={clsx('col-span-10 grid w-full')}>
            <Input value={formData.address} onChange={handler('address')} />
          </div>
          <div className={clsx('col-span-2 mr-2 grid')}>
            <div
              className={clsx('text-md flex grid items-center justify-items-end text-black-600')}
            >
              代表者
            </div>
          </div>
          <div className={clsx('col-span-10 grid w-full')}>
            <Input value={formData.representative} onChange={handler('representative')} />
          </div>
        </div>

        <div className={clsx('mb-10 grid w-full justify-items-center text-xl text-black-600')}>
          <PrimaryButton
            className={'mx-2'}
            onClick={() => {
              submit(formData);
            }}
          >
            登録する
          </PrimaryButton>
        </div>
      </Modal>
    </>
  );
}
