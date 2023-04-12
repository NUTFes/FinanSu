import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { put } from '@api/api_methods';
import {
  PrimaryButton,
  OutlinePrimaryButton,
  CloseButton,
  Input,
  Modal,
  Select,
} from '@components/common';
import { SCALE } from '@constants/scale';
import { SponsorStyle } from '@type/common';

interface ModalProps {
  sponsorStyleId: number;
  sponsorStyle: SponsorStyle;
  setIsOpen: (isOpen: boolean) => void;
}

export default function EditModal(props: ModalProps) {
  const router = useRouter();

  // 協賛スタイルのリスト
  const [formData, setFormData] = useState<SponsorStyle>(props.sponsorStyle);

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  // 協賛スタイルの登録と協賛スタイルの更新を行い、ページをリロード
  const submit = (data: SponsorStyle) => {
    updateSponsorStyle(data);
    router.reload();
  };

  // 協賛スタイルを更新
  const updateSponsorStyle = async (data: SponsorStyle) => {
    const submitData: SponsorStyle = {
      ...data,
      price: Number(data.price),
    };
    const updateSponsorStyleUrl = process.env.CSR_API_URI + '/sponsorstyles/' + data.id;
    await put(updateSponsorStyleUrl, submitData);
  };

  // 協賛スタイルの情報
  const content = (data: SponsorStyle) => (
    <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
      <p className='text-black-600'>広告サイズ</p>
      <div className='col-span-4 w-full'>
        <Select className='w-full' value={data.scale} onChange={handler('scale')}>
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
          value={data.isColor ? 'カラー' : 'モノクロ'}
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
          id={String(data.id)}
          value={data.price}
          onChange={handler('price')}
        />
      </div>
    </div>
  );

  return (
    <Modal className='w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton
            onClick={() => {
              props.setIsOpen(false);
            }}
          />
        </div>
      </div>
      <div className='mx-auto mb-10 w-fit text-xl text-black-600'>協賛スタイルの修正</div>
      <div className=''>
        {content(formData)}
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton
            onClick={() => {
              props.setIsOpen(false);
            }}
          >
            戻る
          </OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              submit(formData);
            }}
          >
            編集完了
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
