import {
  PrimaryButton,
  OutlinePrimaryButton,
  CloseButton,
  Modal,
  Select,
} from '@components/common';
import { SponsorActivity, Sponsor, SponsorStyle, User } from '@type/common';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import { put } from '@/utils/api/sponsorActivities';

interface ModalProps {
  sponsorActivityId: number | string;
  sponsorActivity: SponsorActivity;
  setIsOpen: (isOpen: boolean) => void;
}

export default function EditModal(props: ModalProps) {
  const router = useRouter();

  const [sponsor, setSponsor] = useState<Sponsor[]>([]);
  const [sponsorStyle, setSponsorStyle] = useState<SponsorStyle[]>([]);
  const [user, setUser] = useState<User[]>([]);
  useEffect(() => {
    const getSponsorUrl = process.env.CSR_API_URI + '/sponsors';
    const getSponsorStyleUrl = process.env.CSR_API_URI + '/sponsorstyles';
    const getUserUrl = process.env.CSR_API_URI + '/users';
    const getSponsor = async () => {
      const res = await fetch(getSponsorUrl);
      const data = await res.json();
      setSponsor(data);
    };
    const getSponsorStyle = async () => {
      const res = await fetch(getSponsorStyleUrl);
      const data = await res.json();
      setSponsorStyle(data);
    };
    const getUser = async () => {
      const res = await fetch(getUserUrl);
      const data = await res.json();
      setUser(data);
    };
    getSponsor();
    getSponsorStyle();
    getUser();
  }, []);

  // 協賛企業のリスト
  const [formData, setFormData] = useState<SponsorActivity>(props.sponsorActivity);

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  // 協賛企業の登録の更新を行い、ページをリロード
  const submit = (data: SponsorActivity) => {
    updateSponsorStyle(data);
    router.reload();
  };

  // 協賛企業を更新
  const updateSponsorStyle = async (data: SponsorActivity) => {
    const updateSponsorStyleUrl = process.env.CSR_API_URI + '/activities/' + data.id;
    await put(updateSponsorStyleUrl, data);
  };

  // 協賛企業の情報
  const content = (data: SponsorActivity) => (
    <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
      <p className='text-black-600'>企業名</p>
      <div className='col-span-4 w-full'>
        <Select className='w-full' value={data.sponsorID} onChange={handler('sponsorId')}>
          {sponsor.map((sponsor) => (
            <option key={sponsor.id} value={sponsor.id} selected={sponsor.id === data.sponsorID}>
              {sponsor.name}
            </option>
          ))}
        </Select>
      </div>
      <p className='text-black-600'>協賛スタイル</p>
      <div className='col-span-4 w-full'>
        <Select className='w-full' value={data.sponsorStyleID} onChange={handler('sponsorStyleId')}>
          {sponsorStyle.map((sponsorStyle) => (
            <option
              key={sponsorStyle.id}
              value={sponsorStyle.id}
              selected={sponsorStyle.id === data.sponsorStyleID}
            >
              {`${sponsorStyle.scale} / ${sponsorStyle.isColor?'カラー':'モノクロ'} / ${sponsorStyle.price} 円`}
            </option>
          ))}
        </Select>
      </div>
      <p className='text-black-600'>担当者名</p>
      <div className='col-span-4 w-full'>
        <Select className='w-full' value={data.userID} onChange={handler('userId')}>
          {user.map((user) => (
            <option key={user.id} value={user.id} selected={user.id === data.userID}>
              {user.name}
            </option>
          ))}
        </Select>
      </div>
        <div className='text-black-600'>回収状況</div>
        <div className='col-span-4 w-full'>
        <Select className='w-full' value={data.isDone?'回収完了':'未回収'} onChange={(e) => {setFormData({...formData, isDone: e.target.value === '1' ? true : false})}}>
          <option value='0' selected={data.isDone === false}>
            未回収
          </option>
          <option value='1' selected={data.isDone === true}>
            回収完了
          </option>
        </Select>
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
      <div className='mx-auto mb-10 w-fit text-xl text-black-600'>協賛企業の修正</div>
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
