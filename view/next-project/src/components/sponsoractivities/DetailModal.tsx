import { clsx } from 'clsx';
import React, { FC } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { createSponsoractivitiesPDF } from './createSponsoractivitiesPDF';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';
import { Modal } from '@components/common';
import { DESIGNERS } from '@constants/designers';
import { SponsorActivityView } from '@type/common';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  id: React.ReactNode;
  sponsorActivitiesViewItem: SponsorActivityView;
  isDelete: boolean;
}

const DetailModal: FC<ModalProps> = (props) => {
  const onClose = () => {
    props.setIsOpen(false);
  };

  const formatDate = (date: string) => {
    const datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 10);
    return datetime2;
  };

  return (
    <Modal className='mt-64 md:mt-5 md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <RiCloseCircleLine size={'23px'} color={'gray'} onClick={onClose} />
        </div>
      </div>
      <p className='mx-auto mb-7 w-fit text-2xl font-thin leading-8 tracking-widest text-black-600'>
        協賛活動の詳細
      </p>
      <div className='my-7 flex flex-wrap justify-center gap-7'>
        <div className='flex gap-3'>
          <p className='text-black-600'>作成日</p>
          <p className='border-b border-primary-1'>
            {formatDate(props.sponsorActivitiesViewItem.sponsorActivity.createdAt || '')}
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
      <div className='my-7 flex flex-wrap justify-center gap-7'>
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
        <div className='flex gap-3'>
          <p className='text-black-600'>デザイン</p>
          <p className='border-b border-primary-1'>
            {DESIGNERS[props.sponsorActivitiesViewItem.sponsorActivity.design]}
          </p>
        </div>
      </div>
      <p className='mx-auto my-3 w-fit text-xl text-black-600'>広告データurl</p>
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'></tr>
        </thead>
        <tbody>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
            <td className='py-3'>
              <div>
                <div className='border-primary-1 text-center text-black-600 '>
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
      <p className='mx-auto mb-2 mt-7 w-fit text-xl text-black-600'>備考</p>
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'></tr>
        </thead>
        <tbody>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
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
      <p className='mx-auto mb-2 mt-7 w-fit text-xl text-black-600'>協賛企業</p>
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
      <p className='mx-auto mb-2 mt-7 w-fit text-xl text-black-600'>協賛スタイル</p>
      <table className='mb-4 w-full table-fixed border-collapse'>
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
          {props.sponsorActivitiesViewItem.styleDetail ? (
            props.sponsorActivitiesViewItem.styleDetail.map((styleDetail, index) => (
              <tr
                key={index}
                className={clsx('border border-x-white-0 border-t-white-0', {
                  'border-b-primary-1':
                    index === props.sponsorActivitiesViewItem.styleDetail.length - 1,
                })}
              >
                <td className='py-3'>
                  <div className='text-center text-sm'>{styleDetail.sponsorStyle.style}</div>
                </td>
                <td className='py-3'>
                  <div className='text-center text-sm'>{styleDetail.sponsorStyle.feature}</div>
                </td>
                <td className='py-3'>
                  <div className='text-center text-sm'>{styleDetail.sponsorStyle.price} 円</div>
                </td>
              </tr>
            ))
          ) : (
            <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              <td colSpan={3} className='py-3'>
                <div className='text-center text-sm text-red-500'>
                  協賛スタイルを登録してください
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className='my-5 hidden justify-center md:flex'>
        <PrimaryButton
          onClick={async () => {
            createSponsoractivitiesPDF(props.sponsorActivitiesViewItem);
          }}
        >
          請求書作成
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default DetailModal;
