import React, { useState } from 'react';

import { PreviewPDF, createSponsorActivitiesPDF } from '@/utils/createSponsorActivitiesReceiptsPDF';
import { getToday } from '@/utils/dateConverter';
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
  // 現在の日付を取得
  const today = getToday();

  const [formData, setFormData] = useState<FormDateFormat>({ receivedAt: today });

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
                today,
                formData.receivedAt,
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
            date={today}
            paymentDay={formData.receivedAt}
          />
        </div>
      </div>
    </Modal>
  );
}
