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
      <div className='text-black-600 inline-grid grid-cols-[auto_auto_auto] gap-1 text-sm leading-normal font-medium'>
        <span className='whitespace-nowrap'>未精算金額</span>
        <span className='whitespace-nowrap'>：</span>
        <span className='min-w-[12ch] text-right whitespace-nowrap'>
          {unsettledAmountText}
          {unsettledAmountText !== '-' && <span className='ml-1'>円</span>}
        </span>

        <span className='whitespace-nowrap'>未封詰め金額</span>
        <span className='whitespace-nowrap'>：</span>
        <span className='min-w-[12ch] text-right whitespace-nowrap'>
          {unpackedAmountText}
          {unpackedAmountText !== '-' && <span className='ml-1'>円</span>}
        </span>
      </div>
    </div>
  );
}
