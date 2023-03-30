/* eslint-disable import/no-unresolved */
import { put } from '@api/sponsor';
import { PrimaryButton, CloseButton, Input, Modal } from '@components/common';
import { useUI } from '@components/ui/context';
import { Sponsor } from '@type/common';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface Props {
  sponsor: Sponsor;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SponsorEditModal(props: Props) {
  const router = useRouter();
  const { closeModal } = useUI();

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
    closeModal();
    router.reload();
  };

  return (
    <Modal className='w-1/2'>
      <div className='w-full'>
        <div className='mr-5 w-fit ml-auto'>
          <CloseButton onClick={closeModal} />
        </div>
      </div>
      <h1 className='mb-10 w-fit mx-auto text-xl text-black-600'>
        企業登録
      </h1>
      <div className='my-6 grid grid-cols-5 gap-4 items-center justify-items-center'>
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
          <Input className='w-full' value={formData.representative} onChange={handler('representative')} />
        </div>
      </div>
      <div className='mb-5 w-fit mx-auto'>
        <PrimaryButton
          className={'mx-2'}
          onClick={() => {
            submit(formData);
          }}
        >
          編集する
        </PrimaryButton>
      </div>
    </Modal>
  );
}
