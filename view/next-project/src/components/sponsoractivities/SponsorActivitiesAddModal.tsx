import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { RiArrowDropRightLine } from 'react-icons/ri';

import { post } from '@/utils/api/sponsorActivities';
import {
  CloseButton,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  Select,
  Input
} from '@components/common';
import { SponsorActivity, Sponsor, SponsorStyle, User } from '@type/common';

const TABLE_COLUMNS = ['企業名', '協賛スタイル', '担当者名', '回収状況', 'オプション', '交通費', '備考'];

interface Props {
  users: User[];
  sponsors: Sponsor[];
  sponsorStyles: SponsorStyle[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SponsorActivitiesAddModal(props: Props) {
  const router = useRouter();
  const reset = () => {
    setIsDone(false);
  };

  const [isDone, setIsDone] = useState(false);
  const { users, sponsors, sponsorStyles } = props;

  const [formData, setFormData] = useState<SponsorActivity>({
    id: 0,
    sponsorID: sponsors[0].id || 0,
    sponsorStyleID: sponsorStyles[0].id || 0,
    userID: users[0].id || 0,
    isDone: false,
    feature: '',
    expense: 0,
    remark: '',
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
    props.setIsOpen(false);
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
          {sponsors &&
            sponsors.map((sponsor: Sponsor) => (
              <option key={sponsor.id} value={sponsor.id}>
                {sponsor.name}
              </option>
            ))}
          {!sponsors && <option>企業が登録されていません</option>}
        </Select>
      </div>
      <p className='text-black-600'>協賛スタイル</p>
      <div className='col-span-4 w-full'>
        <Select value={data.sponsorStyleID} onChange={formDataHandler('sponsorStyleID')}>
          {sponsorStyles.map((sponsorStyle: SponsorStyle) => (
            <option key={sponsorStyle.id} value={sponsorStyle.id}>
              {`${sponsorStyle.style} / ${sponsorStyle.feature} / ${sponsorStyle.price} 円`}
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
      <p className='text-black-600'>オプション</p>
      <div className='col-span-4 w-full'>
        <Select
            value={data.feature}
            onChange={formDataHandler('feature')}
        >
          {sponsorStyles[data.sponsorStyleID-1]?.style !== '企業ブース' ?(
            <>
              <option value={'なし'} selected>なし</option>
              <option value={'ポスター'} >ポスター</option>
              <option value={'クーポン'} >クーポン</option>
            </>
          ):(
            <>
              <option value={'なし'} selected>なし</option>
              <option value={'ポスター'} disabled>ポスター</option>
              <option value={'クーポン'} disabled>クーポン</option>
            </>
          )}
        </Select>
      </div>
      <p className='text-black-600'>交通費</p>
      <div className='col-span-4 w-full'>
        <Input
          type='number'
          className='w-full'
          id={String(data.id)}
          value={data.expense}
          onChange={formDataHandler('expense')}
        />
      </div>
      <p className='text-black-600'>備考</p>
      <div className='col-span-4 w-full'>
        <Input
          type='string'
          className='w-full'
          id={String(data.id)}
          value={data.remark}
          onChange={formDataHandler('remark')}
        />
      </div>
    </div>
  );

  const SponsorActivityTable = (sponsorActivities: SponsorActivity) => {
    const sponsorView = sponsors.find(
      (sponsor) => sponsor.id === Number(sponsorActivities.sponsorID),
    );
    const sponsorStyleView = sponsorStyles.find(
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
              <p className='text-center text-sm text-black-600'>{sponsorStyleView?.style}</p>
              <p className='text-center text-sm text-black-600'>{sponsorStyleView?.feature}</p>
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
            <td className='py-3'>
              <div className='text-center text-sm text-black-600'>
                {sponsorActivities.feature}
              </div>
            </td>
            <td className='py-3'>
              <div className='text-center text-sm text-black-600'>
                {sponsorActivities.expense}
              </div>
            </td>
            <td className='py-3'>
              <div className='text-center text-sm text-black-600'>
                {sponsorActivities.remark}
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
                props.setIsOpen(false);
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
                disabled={!sponsors}
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
