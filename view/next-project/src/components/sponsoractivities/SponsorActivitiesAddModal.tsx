import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { RiArrowDropRightLine } from 'react-icons/ri';

import { post } from '@/utils/api/sponsorActivities';
import {
  CloseButton,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  Select,
} from '@components/common';
import { SponsorActivity, Sponsor, SponsorStyle, User } from '@type/common';

import { useUI } from '../ui/context';

const TABLE_COLUMNS = ['企業名', '協賛スタイル', '担当者名', '回収状況'];

export default function SponsorActivitiesAddModal() {
  const router = useRouter();
  const { closeModal } = useUI();
  const reset = () => {
    setIsDone(false);
  };

  // 協賛活動を登録するかどうかのフラグ
  const [isDone, setIsDone] = useState<boolean>(false);

  const [sponsor, setSponsor] = useState<Sponsor[]>([]);
  const [sponsorStyle, setSponsorStyle] = useState<SponsorStyle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const getSponsor = async () => {
      const sponsorUrl = process.env.CSR_API_URI + '/sponsors';
      const res = await fetch(sponsorUrl);
      const data = await res.json();
      setSponsor(data);
    };
    const getSponsorStyle = async () => {
      const sponsorStyleUrl = process.env.CSR_API_URI + '/sponsorstyles';
      const res = await fetch(sponsorStyleUrl);
      const data = await res.json();
      setSponsorStyle(data);
    };
    const getUsers = async () => {
      const usersUrl = process.env.CSR_API_URI + '/users';
      const res = await fetch(usersUrl);
      const data = await res.json();
      setUsers(data);
    };
    getSponsor();
    getSponsorStyle();
    getUsers();
  }, []);

  const [formData, setFormData] = useState<SponsorActivity>({
    id: 0,
    sponsorID: 1,
    sponsorStyleID: 1,
    userID: 1,
    isDone: false,
    createdAt: '',
    updatedAt: '',
  });

  const formDataHandler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  // 協賛活動の登録と更新を行い、ページをリロード
  const submit = (data: SponsorActivity) => {
    addSponsorActivities(data);
    closeModal();
    router.reload();
  };

  // 協賛活動の追加
  const addSponsorActivities = async (data: SponsorActivity) => {
    const sponsorActivitiesUrl = process.env.CSR_API_URI + '/activities';
    await post(sponsorActivitiesUrl, data);
  };

  // 協賛活動の情報
  const content = (data: SponsorActivity) => (
    <div className='mx-auto my-10 grid grid-cols-5 items-center justify-items-center gap-5'>
      <p className='text-black-600'>協賛企業</p>
      <div className='col-span-4 w-full'>
        <Select value={data.sponsorID} onChange={formDataHandler('sponsorID')}>
          {sponsor.map((sponsor: Sponsor) => (
            <option key={sponsor.id} value={sponsor.id}>
              {sponsor.name}
            </option>
          ))}
        </Select>
      </div>
      <p className='text-black-600'>協賛スタイル</p>
      <div className='col-span-4 w-full'>
        <Select value={data.sponsorStyleID} onChange={formDataHandler('sponsorStyleID')}>
          {sponsorStyle.map((sponsorStyle: SponsorStyle) => (
            <option key={sponsorStyle.id} value={sponsorStyle.id}>
              {`${sponsorStyle.scale} / ${sponsorStyle.isColor ? 'カラー' : 'モノクロ'} / ${
                sponsorStyle.price
              } 円`}
            </option>
          ))}
        </Select>
      </div>
      <p className='text-black-600'>担当者名</p>
      <div className='col-span-4 w-full'>
        <Select value={data.userID} onChange={formDataHandler('userID')}>
          {users.map((user: User) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
      </div>
      <p className='text-black-600'>回収状況</p>
      <div className='col-span-4 w-full'>
        <Select
          value={data.isDone ? '回収済み' : '未回収'}
          onChange={(e) => {
            setFormData({ ...formData, isDone: e.target.value === '回収済み' });
          }}
        >
          <option value={'未回収'} selected>
            未回収
          </option>
          <option value={'回収済み'}>回収済み</option>
        </Select>
      </div>
    </div>
  );

  const SponsorActivityTable = (sponsorActivities: SponsorActivity) => {
    const sponsorView = sponsor.find(
      (sponsor) => sponsor.id === Number(sponsorActivities.sponsorID),
    );
    const sponsorStyleView = sponsorStyle.find(
      (sponsorStyle) => sponsorStyle.id === Number(sponsorActivities.sponsorStyleID),
    );
    const userView = users.find((user) => user.id === Number(sponsorActivities.userID));

    return (
      <table className='mb-10 w-full table-fixed border-collapse'>
        <thead>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
            {TABLE_COLUMNS.map((tableColumn: string) => (
              <th key={tableColumn} className='border-b-primary-1 px-6 pb-2'>
                <div className='text-center text-sm text-black-600'>{tableColumn}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
            <td className='py-3'>
              <p className='text-center text-sm text-black-600'>{sponsorView?.name}</p>
            </td>
            <td className='flex flex-col gap-2 py-3'>
              <p className='text-center text-sm text-black-600'>{sponsorStyleView?.scale}</p>
              <p className='text-center text-sm text-black-600'>
                {sponsorStyleView?.isColor ? 'カラー' : 'モノクロ'}
              </p>
              <p className='text-center text-sm text-black-600'>{sponsorStyleView?.price}</p>
            </td>
            <td className='py-3'>
              <div className='text-center text-sm text-black-600'>{userView?.name}</div>
            </td>
            <td className='py-3'>
              <div className='text-center text-sm text-black-600'>
                {sponsorActivities.isDone ? '回収済み' : '未回収'}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <>
      <Modal className='w-1/2'>
        <div className='w-full'>
          <div className='ml-auto w-fit'>
            <CloseButton
              onClick={() => {
                closeModal();
              }}
            />
          </div>
        </div>
        <div className='mx-auto mb-5 w-fit text-xl text-black-600'>協賛活動の登録</div>
        {!isDone && <>{content(formData)}</>}
        {isDone ? (
          <>
            <div className='mx-auto w-fit'>{SponsorActivityTable(formData)}</div>
            <div className='flex flex-row justify-center gap-5'>
              <OutlinePrimaryButton onClick={reset}>戻る</OutlinePrimaryButton>
              <PrimaryButton
                onClick={() => {
                  submit(formData);
                }}
              >
                登録を確定する
              </PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <div className='mx-auto flex w-fit flex-row gap-5'>
              <PrimaryButton
                onClick={() => {
                  setIsDone(true);
                }}
              >
                <p>確認へ</p>
                <RiArrowDropRightLine size={23} />
              </PrimaryButton>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
