import { useState } from 'react';

import { OutlinePrimaryButton } from '@/components/common';
import type { SponsorshipActivity } from '@/generated/model';

import ProgressReportInvoicePdfModal from './ProgressReportInvoicePdfModal';
import ProgressReportReceiptPdfModal from './ProgressReportReceiptPdfModal';

const OUTLINE_ACTION_CLASS_NAME =
  'min-w-28 justify-center border-[#56daff] px-6 py-1.5 text-[#56daff] font-normal';

interface ProgressReportDocumentButtonsProps {
  activity: SponsorshipActivity;
  disabled?: boolean;
}

export default function ProgressReportDocumentButtons({
  activity,
  disabled = false,
}: ProgressReportDocumentButtonsProps) {
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  return (
    <>
      <div className='flex flex-wrap justify-center gap-3 pt-1'>
        <OutlinePrimaryButton
          className={OUTLINE_ACTION_CLASS_NAME + ' min-w-32'}
          onClick={() => setIsReceiptModalOpen(true)}
          disabled={disabled}
        >
          領収書発行
        </OutlinePrimaryButton>
        <OutlinePrimaryButton
          className={OUTLINE_ACTION_CLASS_NAME + ' min-w-32'}
          onClick={() => setIsInvoiceModalOpen(true)}
          disabled={disabled}
        >
          請求書発行
        </OutlinePrimaryButton>
      </div>

      <ProgressReportReceiptPdfModal
        activity={activity}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
      <ProgressReportInvoicePdfModal
        activity={activity}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </>
  );
}
