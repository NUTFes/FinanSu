import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { post } from '@api/sponsorStyle';
import {
  CloseButton,
  Input,
  Modal,
  PrimaryButton,
  Select,
} from '@components/common';
import { SCALE } from '@constants/scale';
import { SponsorStyle } from '@type/common';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function SponsorAddModal(props: ModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<SponsorStyle>({
    scale: SCALE[0],
    isColor: false,
    price: 0,
  });

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const addSponsorStyle = async (data: SponsorStyle) => {
    const addSponsorUrl = process.env.CSR_API_URI + '/sponsorstyles';
    await post(addSponsorUrl, data);
  };

  const submit = async (formData: SponsorStyle) => {
    addSponsorStyle(formData);
    props.setIsOpen(false);
    router.reload();
  };

  return (
    <Modal className='w-1/2'>
      <div className='w-full'>
        <div className='mr-5 ml-auto w-fit'>
          <CloseButton onClick={() => props.setIsOpen(false)} />
        </div>
      </div>
      <h1 className='mx-auto mb-10 w-fit text-xl text-black-600'>協賛スタイルの登録</h1>
      <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
      <p className='text-black-600'>広告サイズ</p>
      <div className='col-span-4 w-full'>
        <Select className='w-full' value={formData.scale} onChange={handler('scale')}>
          {SCALE.map((scale) => (
            <option key={scale} value={scale}>
              {scale}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <div className='text-black-600'>カラー</div>
        <div className='text-black-600'>モノクロ</div>
      </div>
      <div className='col-span-4 grid w-full'>
        <Select
          className='w-full'
          value={formData.isColor ? 'カラー' : 'モノクロ'}
          onChange={(e) => {
            setFormData({ ...formData, isColor: e.target.value === 'カラー' ? true : false });
          }}
        >
          <option value={'カラー'}>カラー</option>
          <option value={'モノクロ'}>モノクロ</option>
        </Select>
      </div>
      <div className='text-black-600'>金額</div>
      <div className='col-span-4 w-full'>
        <Input
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
