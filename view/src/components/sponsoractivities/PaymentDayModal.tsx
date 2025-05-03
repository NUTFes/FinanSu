import React, { useState } from 'react';

import { PreviewPDF, createSponsorActivitiesPDF } from '@/utils/createSponsorActivitiesReceiptsPDF';
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

export default function PaymentDayModal(props: ModalProps) {
  const today = new Date();
  const yyyy = String(today.getFullYear());
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const paymentDay = `${yyyy}-${mm}-${dd}`;
  const ymd = `${yyyy}-${mm}-${dd}`;

  const [formData, setFormData] = useState<FormDateFormat>({ receivedAt: ymd });

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const toReiwaYear = (year: number) => {
    const reiwaStartYear = 2019;
    const reiwaYear = year - reiwaStartYear + 1;
    return reiwaYear === 1 ? '元' : `${reiwaYear}`;
  };
  const getWeekday = (date: Date) => {
    return weekdays[date.getDay()];
  };
  const formatDate = (date: string, showWeekday = true) => {
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const reiwaYear = toReiwaYear(year);
    const weekday = getWeekday(dateObj);
    return `令和${reiwaYear}年${month}月${day}日${showWeekday ? `(${weekday})` : ''}`;
  };

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const onClose = () => {
    props.setIsOpen(false);
  };

  return (
    <Modal className='md:w-1/2' onClick={onClose}>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={onClose} />
        </div>
        <p className='mx-auto mb-7 w-fit text-2xl font-thin leading-8 tracking-widest text-black-600'>
          入金日を入力
        </p>
        <div className='col-span-4 w-full'>
          <Input
            type='date'
            value={formData.receivedAt}
            onChange={handler('receivedAt')}
            className='w-full'
          />
        </div>
        <div className='my-5 hidden justify-center md:flex'>
          <PrimaryButton
            onClick={async () => {
              createSponsorActivitiesPDF(
                props.sponsorActivitiesViewItem,
                formatDate(paymentDay, false),
                formatDate(formData.receivedAt, false),
              );
              onClose();
            }}
          >
            領収書ダウンロード
          </PrimaryButton>
        </div>
        <div className='h-[21rem] justify-center overflow-x-auto md:flex'>
          <PreviewPDF
            sponsorActivitiesViewItem={props.sponsorActivitiesViewItem}
            date={formatDate(paymentDay, false)}
            paymentDay={formatDate(formData.receivedAt, false)}
          />
        </div>
      </div>
    </Modal>
  );
}
