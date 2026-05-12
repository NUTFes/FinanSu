import { useMemo } from 'react';
import { IoMdDownload } from 'react-icons/io';

import { Tooltip } from '@/components/common';

interface Props {
  onClick?: () => void;
  isDisabled?: boolean;
  tooltip?: string;
}

const DownloadButton = (props: Props) => {
  const { onClick, isDisabled = false, tooltip = 'ダウンロード' } = props;

  const buttonClass = useMemo(() => {
    if (isDisabled) {
      return 'cursor-default bg-primary-1 opacity-25';
    } else {
      return 'cursor-pointer bg-linear-to-br from-primary-1 to-primary-2 hover:bg-linear-to-br hover:from-primary-2 hover:to-primary-1';
    }
  }, [isDisabled]);

  return (
    <Tooltip text={tooltip}>
      <button
        disabled={isDisabled}
        className={` ${buttonClass} flex size-6 min-w-0 items-center justify-center rounded-full`}
        onClick={onClick}
        suppressHydrationWarning
      >
        <IoMdDownload size={'15px'} color={'white'} />
      </button>
    </Tooltip>
  );
};

export default DownloadButton;
