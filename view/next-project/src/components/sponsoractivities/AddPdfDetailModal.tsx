import React, { useState } from 'react';

import { OpenEditInvoiceModalButton } from './index';
import { createSponsorActivitiesPDF } from '@/utils/createSponsorActivitiesInvoicesPDF';
import { PreviewPDF } from '@/utils/createSponsorActivitiesInvoicesPDF';
import { CloseButton, Input, Modal, PrimaryButton } from '@components/common';
import {
  SponsorActivityView,
  Invoice,
  SponsorStyleDetail,
  InvoiceSponsorStyle,
} from '@type/common';

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
  const { sponsorActivitiesViewItem } = props;
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

  const sponsorStyleFormatted = (): InvoiceSponsorStyle[] => {
    return sponsorActivitiesViewItem.styleDetail.map((sponsorStyleDetail) => {
      const sponsorStyle = sponsorStyleDetail.sponsorStyle;
      const res: InvoiceSponsorStyle = {
        styleName: `${sponsorStyle.style}(${sponsorStyle.feature})`,
        price: sponsorStyle.price,
      };
      return res;
    });
  };

  const CalculateTotalPrice = () => {
    return sponsorActivitiesViewItem.styleDetail.reduce(
      (price: number, sponsorStyleDetail: SponsorStyleDetail): number => {
        return price + sponsorStyleDetail.sponsorStyle.price;
      },
      0,
    );
  };

  const [invoiceData, setInvoiceDate] = useState<Invoice>({
    sponsorName: sponsorActivitiesViewItem.sponsor.name,
    managerName: sponsorActivitiesViewItem.sponsor.representative,
    totalPrice: CalculateTotalPrice(),
    fesStuffName: sponsorActivitiesViewItem.user.name,
    invoiceSponsorStyle: sponsorStyleFormatted(),
    issuedDate: todayFormatted(),
    deadline: ymd,
    remark: '',
  });

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setInvoiceDate({ ...invoiceData, [input]: e.target.value });
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
          請求書の発行
        </p>
        <div className='col-span-4 w-full'>
          <p className='text-gray-600 mb-3 ml-1 text-sm'>請求書発行日</p>
          <Input
            type='date'
            value={invoiceData.issuedDate}
            onChange={handler('issuedDate')}
            className='mb-3 w-full'
          />
          <p className='text-gray-600 mb-3 ml-1 text-sm'>振込締め切り日</p>
          <Input
            type='date'
            value={invoiceData.deadline}
            onChange={handler('deadline')}
            className='mb-3 w-full'
          />
          <p className='text-gray-600 mb-3 ml-1 text-sm'>備考を入力</p>
          <Input
            type='text'
            value={invoiceData.remark}
            onChange={handler('remark')}
            className='mb-3 w-full'
          />
        </div>
        <div className='mb-3 flex w-full justify-center gap-4'>
          <PrimaryButton
            onClick={async () => {
              createSponsorActivitiesPDF(
                invoiceData,
                formatDate(invoiceData.deadline),
                formatDate(invoiceData.issuedDate, false),
              );
              props.setIsOpen(false);
            }}
          >
            ダウンロード
          </PrimaryButton>
          <OpenEditInvoiceModalButton invoice={invoiceData} setInvoice={setInvoiceDate} />
        </div>
      </div>
      <div className='h-[30rem] justify-center overflow-x-auto md:flex'>
        <PreviewPDF
          invoiceItem={invoiceData}
          deadline={formatDate(invoiceData.deadline)}
          issuedDate={formatDate(invoiceData.issuedDate, false)}
        />
      </div>
    </Modal>
  );
}
