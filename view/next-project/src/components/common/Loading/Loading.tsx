import { useEffect } from 'react';

import { Spinner } from '@/components/common/Spinner';

interface Props {
  text?: string;
  value?: number;
  isProgress?: boolean;
}

function Loading(props: Props) {
  //スクロール禁止
  const stopScrollingBackContent = () => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  };

  useEffect(stopScrollingBackContent, []);

  return (
    <>
      <div
        className='
          fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden
          overflow-y-auto bg-black-300/50 outline-hidden
          focus:outline-hidden
        '
      >
        <div className='relative mx-auto flex items-center gap-2'>
          <Spinner size='xl' color='primary-1' />
          <div className='text-xl font-medium text-white'>{props.text}</div>
        </div>
      </div>
    </>
  );
}

export default Loading;
