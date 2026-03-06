import { useState } from 'react';

import { SponsorActivityView } from '@/type/common';
import { PreviewPDF, createSponsorActivitiesPDF } from '@/utils/createSponsorActivitiesReceiptsPDF';
import { getToday } from '@/utils/dateConverter';
import { Modal, Input, PrimaryButton, CloseButton } from '@components/common';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function AddBlankReceiptModal({ setIsOpen }: ModalProps) {
  const [form, setForm] = useState({
    companyName: '',
    date: getToday(),
    paymentDay: '',
    totalPrice: '',
  });

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const onClose = () => setIsOpen(false);

  const handleDownload = async () => {
    await createSponsorActivitiesPDF(
      {
        sponsor: { name: form.companyName },
        styleDetail: [{ sponsorStyle: { price: Number(form.totalPrice) } }],
        sponsorActivity: { createdAt: form.date },
        user: { name: '' },
      } as SponsorActivityView,
      form.date,
      form.paymentDay,
    );
  };

  return (
    <Modal className='w-[95%] max-w-5xl' onClick={onClose}>
      <div className='flex h-full flex-col'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={onClose} />
        </div>
        <p
          className='
          mx-auto mb-4 w-fit text-2xl/8 font-thin tracking-widest text-black-600
        '
        >
          協賛領収書の発行（手入力）
        </p>

        <div
          className='
          mb-6 flex h-[calc(100%-4rem)] flex-1 gap-4 overflow-hidden
        '
        >
          {/* 入力フォーム */}
          <div className='w-1/2 overflow-y-auto pr-4'>
            <div className='mx-auto max-w-md'>
              <p className='mb-2 ml-1 text-sm text-gray-600'>会社名</p>
              <Input
                type='text'
                value={form.companyName}
                onChange={onChange('companyName')}
                className='mb-4 w-full'
              />
              <p className='mb-2 ml-1 text-sm text-gray-600'>発行日</p>
              <Input
                type='date'
                value={form.date}
                onChange={onChange('date')}
                className='mb-4 w-full'
              />
              <p className='mb-2 ml-1 text-sm text-gray-600'>入金日</p>
              <Input
                type='date'
                value={form.paymentDay}
                onChange={onChange('paymentDay')}
                className='mb-4 w-full'
              />
              <p className='mb-2 ml-1 text-sm text-gray-600'>金額</p>
              <Input
                type='number'
                value={form.totalPrice}
                onChange={onChange('totalPrice')}
                className='mb-6 w-full'
              />

              <div className='mt-4 flex justify-center'>
                <PrimaryButton onClick={handleDownload}>ダウンロード</PrimaryButton>
              </div>
            </div>
          </div>

          {/* プレビュー */}
          <div
            className='
            flex w-1/2 flex-col overflow-hidden border-l border-gray-200 pl-4
          '
          >
            <div className='flex-1 overflow-hidden'>
              <PreviewPDF
                sponsorActivitiesViewItem={
                  {
                    sponsor: { name: form.companyName },
                    styleDetail: [{ sponsorStyle: { price: Number(form.totalPrice || 0) } }],
                    sponsorActivity: { createdAt: form.date },
                    user: { name: '' },
                  } as SponsorActivityView
                }
                date={form.date}
                paymentDay={form.paymentDay}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
