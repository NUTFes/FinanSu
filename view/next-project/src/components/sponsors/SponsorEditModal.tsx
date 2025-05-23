/* eslint-disable import/no-unresolved */
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { put } from '@api/sponsor';
import { PrimaryButton, CloseButton, Input, Modal, Checkbox } from '@components/common';
import { Sponsor } from '@type/common';

interface Props {
  sponsor: Sponsor;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SponsorEditModal(props: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<Sponsor>(props.sponsor);

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const editSponsor = async (data: Sponsor) => {
    const addSponsorUrl = process.env.CSR_API_URI + '/sponsors/' + data.id;
    await put(addSponsorUrl, data);
  };

  const submit = async (formData: Sponsor) => {
    editSponsor(formData);
    props.setIsOpen(false);
    router.reload();
  };

  const [isChecked, setIsChecked] = useState<boolean>(true);

  const closeModal = () => {
    props.setIsOpen(false);
  };

  return (
    <Modal className='md:w-1/2' onClick={closeModal}>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <CloseButton onClick={() => props.setIsOpen(false)} />
        </div>
      </div>
      <h1 className='mx-auto mb-10 w-fit text-xl text-black-600'>企業情報編集</h1>
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
      <label>
        <div className='my-6 flex w-full justify-center '>
          <div>
            <Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
          </div>
          <p className='ml-4 text-black-600 '>
            企業名が正確である。※株式会社などがついている正しいものか
          </p>
        </div>
      </label>
      <div className='mx-auto mb-5 w-fit'>
        <PrimaryButton
          className={'mx-2'}
          onClick={() => {
            submit(formData);
          }}
          disabled={!isChecked}
        >
          編集する
        </PrimaryButton>
      </div>
    </Modal>
  );
}
