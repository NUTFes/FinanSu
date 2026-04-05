import { useEffect, useMemo, useState } from 'react';

import { CloseButton, Input, Modal, OutlinePrimaryButton, PrimaryButton } from '@/components/common';
import type { SponsorshipActivity } from '@/generated/model';
import {
  PreviewPDF,
  createSponsorActivitiesPDF,
} from '@/utils/createSponsorActivitiesReceiptsPDF';
import { getToday } from '@/utils/dateConverter';

import { buildLegacySponsorActivityView, getActivityAmountFromApi } from './progressReportPdfUtils';

interface ProgressReportReceiptPdfModalProps {
  activity: SponsorshipActivity;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgressReportReceiptPdfModal({
  activity,
  isOpen,
  onClose,
}: ProgressReportReceiptPdfModalProps) {
  const today = getToday();
  const [issuedDate, setIssuedDate] = useState(today);
  const [paymentDay, setPaymentDay] = useState(today);
  const sponsorActivityView = useMemo(() => buildLegacySponsorActivityView(activity), [activity]);
  const totalPrice = useMemo(() => getActivityAmountFromApi(activity), [activity]);

  useEffect(() => {
    if (!isOpen) return;
    setIssuedDate(today);
    setPaymentDay(today);
  }, [isOpen, today]);

  if (!isOpen) return null;

  return (
    <Modal className='w-[95%] max-w-5xl' onClick={onClose}>
      <div className='flex h-full flex-col'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={onClose} />
        </div>
        <p
          className='
            text-black-600 mx-auto mb-4 w-fit text-2xl/8 font-thin
            tracking-widest
          '
        >
          領収書の発行
        </p>

        <div className='mb-6 flex h-[calc(100%-4rem)] flex-1 gap-4 overflow-hidden'>
          <div className='w-1/2 overflow-y-auto pr-4'>
            <div className='mx-auto max-w-md'>
              <p className='mb-2 ml-1 text-sm text-gray-600'>発行日</p>
              <Input
                type='date'
                value={issuedDate}
                onChange={(event) => setIssuedDate(event.target.value)}
                className='mb-4 w-full'
              />
              <p className='mb-2 ml-1 text-sm text-gray-600'>入金日</p>
              <Input
                type='date'
                value={paymentDay}
                onChange={(event) => setPaymentDay(event.target.value)}
                className='mb-6 w-full'
              />
              <p className='mb-2 ml-1 text-sm text-gray-600'>合計金額</p>
              <Input
                type='text'
                value={`¥ ${totalPrice.toLocaleString()}`}
                readOnly
                className='mb-6 w-full bg-gray-50'
              />

              <div className='mt-4 flex justify-center gap-4'>
                <OutlinePrimaryButton onClick={onClose}>戻る</OutlinePrimaryButton>
                <PrimaryButton
                  onClick={async () => {
                    await createSponsorActivitiesPDF(sponsorActivityView, issuedDate, paymentDay);
                    onClose();
                  }}
                >
                  領収書ダウンロード
                </PrimaryButton>
              </div>
            </div>
          </div>

          <div className='flex w-1/2 flex-col overflow-hidden border-l border-gray-200 pl-4'>
            <div className='flex-1 overflow-hidden'>
              <PreviewPDF
                sponsorActivitiesViewItem={sponsorActivityView}
                date={issuedDate}
                paymentDay={paymentDay}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
