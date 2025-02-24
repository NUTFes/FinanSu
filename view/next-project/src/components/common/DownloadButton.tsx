import React, { useMemo } from 'react';
import { IoMdDownload } from 'react-icons/io';

interface Props {
  onClick?: () => void;
  isDisabled?: boolean;
}

const DownloadButton = (props: Props) => {
  const { onClick, isDisabled = false } = props;

  const buttonClass = useMemo(() => {
    if (isDisabled) {
      return 'cursor-default bg-primary-1 opacity-25';
    } else {
      return 'cursor-pointer bg-gradient-to-br from-primary-1 to-primary-2 hover:bg-gradient-to-br hover:from-primary-2 hover:to-primary-1';
    }
  }, [isDisabled]);

  return (
    <button
      disabled={isDisabled}
      className={`${buttonClass} flex h-6 w-6 min-w-0 items-center justify-center rounded-full`}
      onClick={onClick}
      suppressHydrationWarning
    >
      <IoMdDownload size={'15px'} color={'white'} />
    </button>
  );
};

export default DownloadButton;
