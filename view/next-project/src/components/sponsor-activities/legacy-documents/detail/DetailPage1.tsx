import { clsx } from 'clsx';
import React, { FC } from 'react';
import { FaChevronCircleRight } from 'react-icons/fa';

import { DESIGNERS } from '@constants/designers';
import { SponsorActivityView } from '@type/common';

import OpenAddPdfDetailModalButton from '../invoice/OpenAddPdfDetailModalButton';
import OpenPaymentDayModalButton from '../receipt/OpenPaymentDayModalButton';

interface ModalProps {
  setPageNum: (isOpen: number) => void;
  children?: React.ReactNode;
  id: React.ReactNode;
  sponsorActivitiesViewItem: SponsorActivityView;
  setIsOpen: (isOpen: boolean) => void;
}

const DetailPage1: FC<ModalProps> = (props) => {
  const toPage2 = () => {
    props.setPageNum(2);
  };

  const formatDate = (date: string) => {
    const datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 10);
    return datetime2;
  };

  return (
    <>
      <p
        className='
          text-black-600 mx-auto mb-7 w-fit text-2xl/8 font-thin tracking-widest
        '
      >
        協賛活動の詳細
      </p>
      <div className='my-7 flex flex-wrap justify-center gap-7'>
        <div className='flex gap-3'>
          <p className='text-black-600'>作成日</p>
          <p className='border-primary-1 border-b'>
            {formatDate(props.sponsorActivitiesViewItem.sponsorActivity.createdAt || '')}
          </p>
        </div>
        <div className='flex gap-3'>
          <p className='text-black-600'>回収状況</p>
          <p className='border-primary-1 border-b'>
            {props.sponsorActivitiesViewItem.sponsorActivity.isDone ? '回収済み' : '未回収'}
          </p>
        </div>
        <div className='flex gap-3'>
          <p className='text-black-600'>担当者名</p>
          <p className='border-primary-1 border-b'>{props.sponsorActivitiesViewItem.user.name}</p>
        </div>
      </div>
      <div className='my-7 flex flex-wrap justify-center gap-7'>
        <div className='flex gap-3'>
          <p className='text-black-600'>オプション</p>
          <p className='border-primary-1 border-b'>
            {props.sponsorActivitiesViewItem.sponsorActivity.feature}
          </p>
        </div>
        <div className='flex gap-3'>
          <p className='text-black-600'>交通費</p>
          <p className='border-primary-1 border-b'>
            {props.sponsorActivitiesViewItem.sponsorActivity.expense}円
          </p>
        </div>
        <div className='flex gap-3'>
          <p className='text-black-600'>デザイン</p>
          <p className='border-primary-1 border-b'>
            {DESIGNERS[props.sponsorActivitiesViewItem.sponsorActivity.design]}
          </p>
        </div>
      </div>
      <p className='text-black-600 mx-auto my-3 w-fit text-xl'>広告データurl</p>
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr className='border-b-primary-1 border-b py-3'></tr>
        </thead>
        <tbody>
          <tr className='border-b-primary-1 border-b'>
            <td className='py-3'>
              <div>
                <div className='border-primary-1 text-black-600 text-center'>
                  {props.sponsorActivitiesViewItem.sponsorActivity.url === '' && <p>なし</p>}
                  {props.sponsorActivitiesViewItem.sponsorActivity.url !== '' && (
                    <a
                      href={props.sponsorActivitiesViewItem.sponsorActivity.url}
                      className='hover:text-black-300 hover:underline'
                    >
                      {props.sponsorActivitiesViewItem.sponsorActivity.url}
                    </a>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p className='text-black-600 mx-auto mb-2 mt-7 w-fit text-xl'>備考</p>
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr className='border-b-primary-1 border-b py-3'></tr>
        </thead>
        <tbody>
          <tr className='border-b-primary-1 border-b'>
            <td className='py-3'>
              <div>
                <p
                  className={clsx('border-primary-1', {
                    'text-center':
                      props.sponsorActivitiesViewItem.sponsorActivity.remark.length < 36,
                  })}
                >
                  {props.sponsorActivitiesViewItem.sponsorActivity.remark === '' && <div>なし</div>}
                  {props.sponsorActivitiesViewItem.sponsorActivity.remark}
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p className='text-black-600 mx-auto mb-2 mt-7 w-fit text-xl'>協賛企業</p>
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr className='border-b-primary-1 border-b py-3'>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-black-600 text-center text-sm'>企業名</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-black-600 text-center text-sm'>電話番号</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-black-600 text-center text-sm'>メール</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-black-600 text-center text-sm'>住所</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-black-600 text-center text-sm'>代表者名</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className='border-b-primary-1 border-b'>
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
      <div
        className='
          mt-5 hidden justify-center gap-3
          md:flex
        '
      >
        <OpenAddPdfDetailModalButton
          sponsorActivitiesViewItem={props.sponsorActivitiesViewItem}
          setIsOpen={props.setIsOpen}
        />
        <OpenPaymentDayModalButton
          sponsorActivitiesViewItem={props.sponsorActivitiesViewItem}
          setIsOpen={props.setIsOpen}
        />
      </div>
      <div className='mt-2 flex justify-end'>
        <button
          onClick={() => toPage2()}
          className='
            hover:bg-grey-300
            rounded-full
          '
        >
          <FaChevronCircleRight size={30} />
        </button>
      </div>
    </>
  );
};

export default DetailPage1;
