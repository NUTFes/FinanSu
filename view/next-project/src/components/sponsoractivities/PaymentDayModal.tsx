import React, { useState } from 'react';

import { createSponsorActivityFormPdf } from '@/utils/createSponsorActivityPdf';
import { downloadFile } from '@/utils/downloadFile';
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
  const issueDay = `${yyyy}年${mm}月${dd}日`;
  const ymd = `${yyyy}-${mm}-${dd}`;

  const [formData, setFormData] = useState<FormDateFormat>({ receivedAt: ymd });

  const formatDate = (date: string) => {
    const arrayDate = date.split("-");
    return String(arrayDate[0] + "年" + arrayDate[1] + "月" + arrayDate[2] + "日");
  };

  const handler = (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
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
        <p className='mx-auto mb-7 w-fit text-2xl font-thin leading-8 tracking-widest text-black-600'>入金日を入力</p>
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
              downloadFile({
                downloadContent: await createSponsorActivityFormPdf(
                  props.sponsorActivitiesViewItem,
                  issueDay,
                  formatDate(formData.receivedAt)
                ),
                fileName: `領収書_${yyyy}${mm}${dd}_${props.sponsorActivitiesViewItem.sponsor.name}.pdf`,
                isBomAdded: true,
              });
            }}
          >
            領収書ダウンロード
          </PrimaryButton>
        </div>
      </div>
    </Modal >
  )
}