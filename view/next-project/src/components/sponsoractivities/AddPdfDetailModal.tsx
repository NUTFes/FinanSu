import React, { useState } from 'react';

import { OpenEditInvoiceModalButton } from './index';
import { createSponsorActivitiesPDF } from '@/utils/createSponsorActivitiesInvoicesPDF';
import { PreviewPDF } from '@/utils/createSponsorActivitiesInvoicesPDF';
import { getToday } from '@/utils/dateConverter';
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

export default function AddPdfDetailModal(props: ModalProps) {
  const { sponsorActivitiesViewItem } = props;

  const sponsorStyleFormatted = (): InvoiceSponsorStyle[] => {
    return sponsorActivitiesViewItem.styleDetail.map((sponsorStyleDetail) => {
      const sponsorStyle = sponsorStyleDetail.sponsorStyle;
      const res: InvoiceSponsorStyle = {
        styleName: `${sponsorStyle.style}(${sponsorStyle.feature})`,
        price: sponsorStyle.price,
        quantity: 1,
        unitPrice: sponsorStyle.price,
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
    issuedDate: getToday(),
    deadline: getToday(),
    remark: '',
    subject: '',
  });

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setInvoiceDate({ ...invoiceData, [input]: e.target.value });
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
              createSponsorActivitiesPDF(invoiceData, invoiceData.deadline, invoiceData.issuedDate);
              onClose();
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
          deadline={invoiceData.deadline}
          issuedDate={invoiceData.issuedDate}
        />
      </div>
    </Modal>
  );
}
