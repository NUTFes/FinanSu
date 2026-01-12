import React, { useMemo } from 'react';
import { RiPencilFill } from 'react-icons/ri';

interface Props {
  onClick?: () => void;
  isDisabled?: boolean;
  size?: 'S' | 'M' | 'L';
}

const EditButton: React.FC<Props> = (props) => {
  const { onClick, isDisabled = false, size } = props;

  const buttonClass = useMemo(() => {
    if (isDisabled) {
      return 'cursor-default bg-primary-1 opacity-25';
    } else {
      return 'cursor-pointer bg-gradient-to-br from-primary-1 to-primary-2 hover:bg-gradient-to-br hover:from-primary-2 hover:to-primary-1';
    }
  }, [isDisabled]);

  const buttonSizeClass = useMemo(() => {
    switch (size) {
      case 'S':
        return 'h-6 w-6 min-h-[24px] min-w-[24px]';
      case 'M':
        return 'h-12 w-12 min-h-[48px] min-w-[48px]';
      case 'L':
        return 'h-24 w-24 min-h-[96px] min-w-[96px]';
      default:
        return 'h-6 w-6 min-h-[24px] min-w-[24px]';
    }
  }, [size]);

  const iconSize = (): string => {
    switch (size) {
      case 'S':
        return '12';
      case 'M':
        return '20';
      case 'L':
        return '30';
      default:
        return '12';
    }
  };

  return (
    <button
      suppressHydrationWarning
      className={`${buttonClass} ${buttonSizeClass} flex items-center justify-center rounded-full p-0`}
      disabled={isDisabled}
      onClick={(e) => {
        if (onClick) onClick();
        e.stopPropagation();
      }}
    >
      <RiPencilFill size={`${iconSize()}px`} color={'white'} />
    </button>
  );
};

export default EditButton;
