import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { post } from '@api/api_methods';
import { CloseButton, Input, Modal, PrimaryButton } from '@components/common';
import { SponsorStyle } from '@type/common';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function SponsorAddModal(props: ModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<SponsorStyle>({
    style: '',
    feature: '',
    price: 0,
  });

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const addSponsorStyle = async (data: SponsorStyle) => {
    const submitData: SponsorStyle = {
      ...data,
      price: Number(data.price),
    };
    const addSponsorUrl = process.env.CSR_API_URI + '/sponsorstyles';
    await post(addSponsorUrl, submitData);
  };

  const submit = async (formData: SponsorStyle) => {
    addSponsorStyle(formData);
    props.setIsOpen(false);
    router.reload();
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <CloseButton onClick={() => props.setIsOpen(false)} />
        </div>
      </div>
      <h1 className='mx-auto mb-10 w-fit text-xl text-black-600'>協賛スタイルの登録</h1>
      <div className='my-6 grid grid-cols-5 place-items-center gap-4'>
        <p className='text-black-600'>協賛内容</p>
        <div className='col-span-4 w-full'>
          <Input
            type='text'
            className='w-full'
            id={String(formData.id)}
            value={formData.style}
            onChange={handler('style')}
          />
        </div>
        <div className='text-black-600'>オプション</div>
        <div className='col-span-4 grid w-full'>
          <Input
            type='text'
            className='w-full'
            id={String(formData.id)}
            value={formData.feature}
            onChange={handler('feature')}
          />
        </div>
        <div className='text-black-600'>金額</div>
        <div className='col-span-4 w-full'>
          <Input
            type='number'
            className='w-full'
            id={String(formData.id)}
            value={formData.price}
            onChange={handler('price')}
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
