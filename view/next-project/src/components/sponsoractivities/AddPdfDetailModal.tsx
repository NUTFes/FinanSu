import React, { useState } from 'react';

import { createSponsorActivitiesPDF } from '@/utils/createSponsorActivitiesInvoicesPDF';
import { PreviewPDF } from '@/utils/createSponsorActivitiesInvoicesPDF';
import { CloseButton, Input, Modal, PrimaryButton } from '@components/common';
import { SponsorActivityView } from '@type/common';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
  sponsorActivitiesViewItem: SponsorActivityView;
  children?: React.ReactNode;
}

interface FormDateFormat {
  receivedAt: string;
  billIssuedAt: string;
}

export default function AddPdfDetailModal(props: ModalProps) {
  const today = new Date();
  const yyyy = String(today.getFullYear());
  const mm = '08';
  const dd = '30';
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

  const formatDate = (date: string, showWeekday = true) => {
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const reiwaYear = toReiwaYear(year);
    const weekday = getWeekday(dateObj);
    return `令和${reiwaYear}年${month}月${day}日${showWeekday ? `(${weekday})` : ''}`;
  };

  const todayFormatted = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate(),
    ).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState<FormDateFormat>({
    receivedAt: ymd,
    billIssuedAt: todayFormatted(),
  });
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
    <Modal className='md:w-1/2'>
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
          <p className='text-gray-600 mb-3 ml-1 text-sm'>請求書発行日</p>
          <Input
            type='date'
            value={formData.billIssuedAt}
            onChange={handler('billIssuedAt')}
            className='mb-3 w-full'
          />
          <p className='text-gray-600 mb-3 ml-1 text-sm'>振込締め切り日</p>
          <Input
            type='date'
            value={formData.receivedAt}
            onChange={handler('receivedAt')}
            className='mb-3 w-full'
          />
          <p className='text-gray-600 mb-3 ml-1 text-sm'>備考を入力</p>
          <Input
            type='text'
            value={remarks}
            onChange={handleRemarksChange}
            className='mb-3 w-full'
          />
        </div>
        <div className='mb-3 flex w-full justify-center'>
          <PrimaryButton
            onClick={async () => {
              createSponsorActivitiesPDF(
                props.sponsorActivitiesViewItem,
                formatDate(formData.receivedAt),
                formatDate(formData.billIssuedAt, false),
                remarks,
              );
              props.setIsOpen(false);
            }}
          >
            ダウンロード
          </PrimaryButton>
        </div>
      </div>
      <div className='h-[30rem] justify-center overflow-x-auto md:flex'>
        <PreviewPDF
          sponsorActivitiesViewItem={props.sponsorActivitiesViewItem}
          date={formatDate(formData.receivedAt)}
          issuedDate={formatDate(formData.billIssuedAt, false)}
          remarks={remarks}
        />
      </div>
    </Modal>
  );
}
