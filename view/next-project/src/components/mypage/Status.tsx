import { GrStatusGoodSmall } from 'react-icons/gr';

interface StatusProps {
  status: '確認中...' | '封詰め' | '清算完了' | null;
}

const Status = ({ status }: StatusProps) => {
  if (!status) return null;

  let statusText = '';
  let iconColor = '';

  switch (status) {
    case '確認中...':
      statusText = '確認中';
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
      <div className='text-black text-sm font-normal text-nowrap'>{statusText}</div>
    </div>
  );
};

export default Status;
