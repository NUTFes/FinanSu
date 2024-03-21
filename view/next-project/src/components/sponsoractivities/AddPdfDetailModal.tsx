import React, { useState } from 'react';

import { createSponsoractivitiesPDF } from '@/utils/createSponsoractivitiesReceiptPDF';
import { CloseButton, Input, Modal, PrimaryButton } from '@components/common';
import { SponsorActivityView } from '@type/common';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
  sponsorActivitiesViewItem: SponsorActivityView;
  children?: React.ReactNode;
}

interface FormDateFormat {
  receivedAt: string;
}

export default function AddPdfDetailModal(props: ModalProps) {
  const today = new Date();
  const yyyy = String(today.getFullYear());
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const toReiwaYear = (year: number) => {
    const reiwaStartYear = 2019;
    const reiwaYear = year - reiwaStartYear + 1;
    return reiwaYear === 1 ? '元' : `${reiwaYear}`;
  };
  const getWeekday = (date: Date) => {
    return weekdays[date.getDay()];
  };
  const ymd = `${yyyy}-${mm}-${dd}`;

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const reiwaYear = toReiwaYear(year);
    const weekday = getWeekday(dateObj);
    return `令和${reiwaYear}年${month}月${day}日(${weekday})`;
  };

  const [formData, setFormData] = useState<FormDateFormat>({ receivedAt: ymd });
  const [remarks, setRemarks] = useState('');

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const handleRemarksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(e.target.value);
  };

  return (
    <Modal className='mt-64 md:mt-32 md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton
            onClick={() => {
              props.setIsOpen(false);
            }}
          />
        </div>
        <p className='mx-auto mb-7 w-fit text-2xl font-thin leading-8 tracking-widest text-black-600'>
          振込締め切り日・備考の入力
        </p>
        <div className='col-span-4 w-full'>
          <Input
            type='date'
            value={formData.receivedAt}
            onChange={handler('receivedAt')}
            className='mb-3 w-full'
          />
          <Input
            placeholder='備考を入力'
            type='text'
            value={remarks}
            onChange={handleRemarksChange}
            className='w-full'
          />
        </div>
        <div className='my-5 hidden justify-center md:flex'>
          <PrimaryButton
            onClick={async () => {
              createSponsoractivitiesPDF(
                props.sponsorActivitiesViewItem,
                formatDate(formData.receivedAt),
                remarks,
              );
            }}
          >
            請求書ダウンロード
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
