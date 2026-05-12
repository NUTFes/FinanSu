interface PurchaseReportSummaryAmountsProps {
  unsettledAmountText: string;
  unpackedAmountText: string;
  className?: string;
}

export default function PurchaseReportSummaryAmounts({
  unsettledAmountText,
  unpackedAmountText,
  className = '',
}: PurchaseReportSummaryAmountsProps) {
  return (
    <div className={className}>
      <div className='inline-grid grid-cols-[auto_auto_auto] gap-1 text-sm font-medium leading-normal text-black-600 [font-family:"Noto_Sans_JP"]'>
        <span className='whitespace-nowrap'>未清算金額</span>
        <span className='whitespace-nowrap'>：</span>
        <span className='min-w-[12ch] whitespace-nowrap text-right'>
          {unsettledAmountText}
          <span className='ml-1'>円</span>
        </span>

        <span className='whitespace-nowrap'>未封詰め金額</span>
        <span className='whitespace-nowrap'>：</span>
        <span className='min-w-[12ch] whitespace-nowrap text-right'>
          {unpackedAmountText}
          <span className='ml-1'>円</span>
        </span>
      </div>
    </div>
  );
}
