import { OutlinePrimaryButton } from '@/components/common';

interface ProgressReportHeaderProps {
  onDocumentPlaceholder: (documentType: 'receipt' | 'invoice') => void;
}

export default function ProgressReportHeader({
  onDocumentPlaceholder,
}: ProgressReportHeaderProps) {
  return (
    <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
      <div className='text-2xl leading-8 font-thin tracking-[0.2em] text-[#666666]'>進捗報告</div>
      <div className='flex flex-wrap gap-3'>
        <OutlinePrimaryButton
          className='min-w-52 justify-center border-[#56daff] px-4 py-1.5 text-md text-[#56daff] font-normal'
          onClick={() => onDocumentPlaceholder('receipt')}
        >
          手書きで領収書発行
        </OutlinePrimaryButton>
        <OutlinePrimaryButton
          className='min-w-52 justify-center border-[#56daff] px-4 py-1.5 text-md text-[#56daff] font-normal'
          onClick={() => onDocumentPlaceholder('invoice')}
        >
          手書きで請求書発行
        </OutlinePrimaryButton>
      </div>
    </div>
  );
}
