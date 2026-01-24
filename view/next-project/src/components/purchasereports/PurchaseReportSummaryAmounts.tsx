import React from 'react';

interface PurchaseReportSummaryAmountsProps {
  unsettledAmountText: string;
  unpackedAmountText: string;
  className?: string;
}

export default function PurchaseReportSummaryAmounts({
  unsettledAmountText,
  unpackedAmountText,
  className = 'text-sm text-black-600 md:ml-auto',
}: PurchaseReportSummaryAmountsProps) {
  return (
    <div className={className}>
      <div className='inline-grid grid-cols-[auto_auto_auto] gap-1'>
        <span className='whitespace-nowrap'>未清算金額</span>
        <span className='whitespace-nowrap'>：</span>
        <span className='min-w-[12ch] whitespace-nowrap text-right'>{unsettledAmountText} 円</span>
        <span className='whitespace-nowrap'>未封詰め金額</span>
        <span className='whitespace-nowrap'>：</span>
        <span className='min-w-[12ch] whitespace-nowrap text-right'>{unpackedAmountText} 円</span>
      </div>
    </div>
  );
}
