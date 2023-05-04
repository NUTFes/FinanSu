import React, { FC } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import { Modal } from '@components/common';
import { SponsorActivityView } from '@type/common';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  id: React.ReactNode;
  sponsorActivitiesViewItem: SponsorActivityView;
  isDelete: boolean;
}

const DetailModal: FC<ModalProps> = (props) => {
  const [user] = useRecoilState(userAtom);

  const onClose = () => {
    props.setIsOpen(false);
  };

  const formatDate = (date: string) => {
    const datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 10);
    return datetime2;
  };


  return (
    <Modal className='w-1/2'>
      <div className='w-full'>
        <div className='mr-5 ml-auto w-fit'>
          <RiCloseCircleLine size={'23px'} color={'gray'} onClick={onClose} />
        </div>
      </div>
      <p className='mx-auto mb-8 w-fit text-2xl font-thin leading-8 tracking-widest text-black-600'>
        協賛活動の詳細
      </p>
      <div className='my-10 flex flex-wrap justify-center gap-8'>
        <div className='flex gap-3'>
          <p className='text-black-600'>作成日</p>
          <p className='border-b border-primary-1'>
            {formatDate(props.sponsorActivitiesViewItem.sponsorActivity.createdAt||"")}
          </p>
        </div>
        <div className='flex gap-3'>
          <p className='text-black-600'>回収状況</p>
          <p className='border-b border-primary-1'>
            {props.sponsorActivitiesViewItem.sponsorActivity.isDone ? '回収済み' : '未回収'}
          </p>
        </div>
        <div className='flex gap-3'>
          <p className='text-black-600'>担当者名</p>
          <p className='border-b border-primary-1'>{props.sponsorActivitiesViewItem.user.name}</p>
        </div>
      </div>
      <div  className='my-10 flex flex-wrap justify-center gap-8'>
        <div className='flex gap-3'>
          <p className='text-black-600'>オプション</p>
          <p className='border-b border-primary-1'>
            {props.sponsorActivitiesViewItem.sponsorActivity.feature}
          </p>
        </div>
        <div className='flex gap-3'>
          <p className='text-black-600'>交通費</p>
          <p className='border-b border-primary-1'>
            {props.sponsorActivitiesViewItem.sponsorActivity.expense}円
          </p>
        </div>
      </div>
      <p className='my-5 mx-auto w-fit text-xl text-black-600'>備考</p>
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
          </tr>
        </thead>
        <tbody>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
            <td className='py-3'>
              <div>
                <p className={clsx('border-primary-1', {
                  'text-center': props.sponsorActivitiesViewItem.sponsorActivity.remark.length < 36,
                })}>
                  {props.sponsorActivitiesViewItem.sponsorActivity.remark === '' && (
                    <div>なし</div>
                  )}
                  {props.sponsorActivitiesViewItem.sponsorActivity.remark}
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p className='my-5 mx-auto w-fit text-xl text-black-600'>協賛企業</p>
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>企業名</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>電話番号</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>メール</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>住所</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>代表者名</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
            <td className='py-3'>
              <div className='text-center text-sm'>
                {props.sponsorActivitiesViewItem.sponsor.name}
              </div>
            </td>
            <td className='py-3'>
              <div className='text-center text-sm'>
                {props.sponsorActivitiesViewItem.sponsor.tel}
              </div>
            </td>
            <td className='py-3'>
              <div className='text-center text-sm'>
                {props.sponsorActivitiesViewItem.sponsor.email}
              </div>
            </td>
            <td className='py-3'>
              <div className='text-center text-sm'>
                {props.sponsorActivitiesViewItem.sponsor.address}
              </div>
            </td>
            <td className='py-3'>
              <div className='text-center text-sm'>
                {props.sponsorActivitiesViewItem.sponsor.representative}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p className='mx-auto mb-5 mt-10 w-fit text-xl text-black-600'>協賛スタイル</p>
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>協賛内容</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>オプション</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>値段</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
            <td className='py-3'>
              <div className='text-center text-sm'>
                {props.sponsorActivitiesViewItem.sponsorStyle.style}
              </div>
            </td>
            <td className='py-3'>
              <div className='text-center text-sm'>
                {props.sponsorActivitiesViewItem.sponsorStyle.feature}
              </div>
            </td>
            <td className='py-3'>
              <div className='text-center text-sm'>
                {props.sponsorActivitiesViewItem.sponsorStyle.price}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};

export default DetailModal;
