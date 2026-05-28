import { useEffect, useMemo, useState } from 'react';

import {
  CloseButton,
  Input,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  Textarea,
} from '@/components/common';
import { PreviewPDF, createSponsorActivitiesPDF } from '@/utils/createSponsorActivitiesInvoicesPDF';
import { getToday } from '@/utils/dateConverter';

import { buildInvoiceFromActivity, getActivityAmountFromApi } from './progressReportPdfUtils';

import type { SponsorshipActivity } from '@/generated/model';

interface ProgressReportInvoicePdfModalProps {
  activity: SponsorshipActivity;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgressReportInvoicePdfModal({
  activity,
  isOpen,
  onClose,
}: ProgressReportInvoicePdfModalProps) {
  const today = getToday();
  const baseInvoice = useMemo(() => buildInvoiceFromActivity(activity), [activity]);
  const totalPrice = useMemo(() => getActivityAmountFromApi(activity), [activity]);
  const [issuedDate, setIssuedDate] = useState(today);
  const [deadline, setDeadline] = useState(today);
  const [sponsorName, setSponsorName] = useState(baseInvoice.sponsorName);
  const [managerName, setManagerName] = useState(baseInvoice.managerName);
  const [subject, setSubject] = useState(baseInvoice.subject);
  const [fesStuffName, setFesStuffName] = useState(baseInvoice.fesStuffName);
  const [remark, setRemark] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIssuedDate(today);
    setDeadline(today);
    setSponsorName(baseInvoice.sponsorName);
    setManagerName(baseInvoice.managerName);
    setSubject(baseInvoice.subject);
    setFesStuffName(baseInvoice.fesStuffName);
    setRemark('');
  }, [
    isOpen,
    today,
    baseInvoice.sponsorName,
    baseInvoice.managerName,
    baseInvoice.subject,
    baseInvoice.fesStuffName,
  ]);

  if (!isOpen) return null;

  const invoice = {
    ...baseInvoice,
    issuedDate,
    deadline,
    sponsorName,
    managerName,
    subject,
    fesStuffName,
    remark,
  };

  return (
    <Modal className='h-[90vh] w-[95%] max-w-7xl' onClick={onClose}>
      <div className='flex h-full flex-col'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={onClose} />
        </div>
        <p className='text-black-600 mx-auto mb-4 w-fit text-2xl/8 font-thin tracking-widest'>
          請求書の発行
        </p>

        <div className='flex h-[calc(100%-4rem)] flex-1 gap-4 overflow-hidden p-4'>
          <div className='w-1/2 overflow-y-auto pr-4'>
            <div className='grid grid-cols-1 gap-4'>
              <div>
                <p className='mb-2 ml-1 text-sm text-gray-600'>企業名</p>
                <Input
                  type='text'
                  value={sponsorName}
                  onChange={(event) => setSponsorName(event.target.value)}
                  className='mb-3 w-full'
                />
                <p className='mb-2 ml-1 text-sm text-gray-600'>担当者名(企業)</p>
                <Input
                  type='text'
                  value={managerName}
                  onChange={(event) => setManagerName(event.target.value)}
                  className='mb-3 w-full'
                />
                <p className='mb-2 ml-1 text-sm text-gray-600'>件名</p>
                <Input
                  type='text'
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className='mb-3 w-full'
                />
                <p className='mb-2 ml-1 text-sm text-gray-600'>請求日</p>
                <Input
                  type='date'
                  value={issuedDate}
                  onChange={(event) => setIssuedDate(event.target.value)}
                  className='mb-3 w-full'
                />
                <p className='mb-2 ml-1 text-sm text-gray-600'>振込締切日</p>
                <Input
                  type='date'
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className='mb-3 w-full'
                />
                <p className='mb-2 ml-1 text-sm text-gray-600'>担当者名(実行委員)</p>
                <Input
                  type='text'
                  value={fesStuffName}
                  onChange={(event) => setFesStuffName(event.target.value)}
                  className='mb-3 w-full'
                />
                <p className='mb-2 ml-1 text-sm text-gray-600'>合計金額</p>
                <Input
                  type='text'
                  value={`¥ ${totalPrice.toLocaleString()}`}
                  readOnly
                  className='mb-3 w-full bg-gray-50'
                />
                <p className='mb-2 ml-1 text-sm text-gray-600'>備考</p>
                <Textarea
                  value={remark}
                  onChange={(event) => setRemark(event.target.value)}
                  className='mb-3 w-full'
                />
              </div>

              <div className='mt-4 flex justify-center gap-4'>
                <OutlinePrimaryButton onClick={onClose}>戻る</OutlinePrimaryButton>
                <PrimaryButton
                  disabled={isGenerating}
                  onClick={async () => {
                    if (isGenerating) return;
                    setIsGenerating(true);
                    try {
                      await createSponsorActivitiesPDF(invoice, deadline, issuedDate);
                      onClose();
                    } catch (error) {
                      console.error('Failed to generate invoice PDF:', error);
                    } finally {
                      setIsGenerating(false);
                    }
                  }}
                >
                  請求書ダウンロード
                </PrimaryButton>
              </div>
            </div>
          </div>

          <div className='flex w-1/2 flex-col overflow-hidden border-l border-gray-200 pl-4'>
            <div className='flex-1 overflow-hidden'>
              <PreviewPDF invoiceItem={invoice} deadline={deadline} issuedDate={issuedDate} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
