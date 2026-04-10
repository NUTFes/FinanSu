import { useState } from 'react';

import { OutlinePrimaryButton } from '@/components/common';
import {
  AddBlankInvoiceModal,
  AddBlankReceiptModal,
} from '@/components/sponsor-activities/legacy-documents';
import type { SponsorStyle } from '@/type/common';

interface ProgressReportHeaderProps {
  sponsorStyles: SponsorStyle[];
}

export default function ProgressReportHeader({ sponsorStyles }: ProgressReportHeaderProps) {
  const [isBlankReceiptModalOpen, setIsBlankReceiptModalOpen] = useState(false);
  const [isBlankInvoiceModalOpen, setIsBlankInvoiceModalOpen] = useState(false);

  return (
    <>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
        <div className='text-2xl font-thin leading-8 tracking-[0.2em] text-[#666666]'>進捗報告</div>
        <div className='flex flex-wrap gap-3'>
          <OutlinePrimaryButton
            className='min-w-52 text-md justify-center border-[#56daff] px-4 py-1.5 font-normal text-[#56daff]'
            onClick={() => setIsBlankReceiptModalOpen(true)}
          >
            手書きで領収書発行
          </OutlinePrimaryButton>
          <OutlinePrimaryButton
            className='min-w-52 text-md justify-center border-[#56daff] px-4 py-1.5 font-normal text-[#56daff]'
            onClick={() => setIsBlankInvoiceModalOpen(true)}
          >
            手書きで請求書発行
          </OutlinePrimaryButton>
        </div>
      </div>

      {isBlankReceiptModalOpen && <AddBlankReceiptModal setIsOpen={setIsBlankReceiptModalOpen} />}
      {isBlankInvoiceModalOpen && (
        <AddBlankInvoiceModal
          setIsOpen={setIsBlankInvoiceModalOpen}
          sponsorStyles={sponsorStyles}
        />
      )}
    </>
  );
}
