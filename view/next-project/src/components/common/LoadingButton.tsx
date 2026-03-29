import * as React from 'react';

import { Spinner } from '@/components/common/Spinner';

interface Props {
  loadingText: string;
  height?: string;
  width?: string;
  children?: React.ReactNode;
}

export default function LoadingButton(props: Props) {
  const { loadingText, height, width } = props;

  return (
    <button
      className='
        bg-linear-to-br from-primary-1 to-primary-2 text-white-0 flex items-center
        justify-center gap-2 rounded-md px-4 py-2
      '
      style={{ height, width }}
      disabled
    >
      <Spinner size='sm' color='white' />
      <span>{loadingText}</span>
    </button>
  );
}
