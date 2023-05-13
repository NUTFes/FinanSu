import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { post } from '@api/sponsor';
import { PrimaryButton, CloseButton, Input, Modal } from '@components/common';
import { useUI } from '@components/ui/context';
import { Sponsor } from '@type/common';

export default function SponsorAddModal() {
  const router = useRouter();
  const { closeModal } = useUI();

  const [formData, setFormData] = useState<Sponsor>({
    name: '',
    tel: '',
    email: '',
    address: '',
    representative: '',
  });

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const addSponsor = async (data: Sponsor) => {
    const addSponsorUrl = process.env.CSR_API_URI + '/sponsors';
    await post(addSponsorUrl, data);
  };

  const submit = async (formData: Sponsor) => {
    addSponsor(formData);
    closeModal();
    router.reload();
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='mr-5 ml-auto w-fit'>
          <CloseButton onClick={closeModal} />
        </div>
      </div>
      <h1 className='mx-auto mb-10 w-fit text-xl text-black-600'>企業登録</h1>
      <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
        <p className='col-span-1 text-black-600'>企業名</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.name} onChange={handler('name')} />
        </div>
        <p className='col-span-1 text-black-600'>電話番号</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.tel} onChange={handler('tel')} />
        </div>
        <p className='col-span-1 text-black-600'>メール</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.email} onChange={handler('email')} />
        </div>
        <p className='col-span-1 text-black-600'>住所</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.address} onChange={handler('address')} />
        </div>
        <p className='col-span-1 text-black-600'>代表者</p>
        <div className='col-span-4 w-full'>
          <Input
            className='w-full'
            value={formData.representative}
            onChange={handler('representative')}
          />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit'>
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
  );
}
