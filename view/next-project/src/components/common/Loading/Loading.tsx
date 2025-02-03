import { CircularProgress } from '@chakra-ui/react';
import React, { useEffect } from 'react';

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
      <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-300/50 outline-none focus:outline-none'>
        <div className='relative mx-auto flex  items-center gap-2'>
          <CircularProgress
            isIndeterminate={!props.isProgress}
            color='blue.500'
            size='120px'
            thickness='4px'
            value={props.value}
          />
          <div className='text-white text-xl font-medium'>{props.text}</div>
        </div>
      </div>
    </>
  );
}

export default Loading;
