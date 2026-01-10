import { GrStatusGoodSmall } from 'react-icons/gr';

import type { BuyReportInformationStatus } from '@/generated/model';

interface StatusProps {
  status: BuyReportInformationStatus;
}

const Status = ({ status }: StatusProps) => {
  let statusText = '';
  let iconColor = '';

  switch (status) {
    case '確認中':
      statusText = '確認中...';
      iconColor = '#FFA53C';
      break;
    case '封詰め':
      statusText = '封詰め';
      iconColor = '#4FDE6E';
      break;
    case '清算完了':
      statusText = '清算完了';
      iconColor = '#7087FF';
      break;
    default:
      statusText = '';
      iconColor = '';
  }

  return (
    <div className='flex items-center gap-2'>
      <GrStatusGoodSmall size={'15px'} color={iconColor} />
      <div className='text-black text-nowrap text-sm font-normal'>{statusText}</div>
    </div>
  );
};

export default Status;
