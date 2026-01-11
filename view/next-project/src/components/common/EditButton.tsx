import React, { useMemo } from 'react';
import { RiPencilFill } from 'react-icons/ri';

interface Props {
  onClick?: () => void;
  isDisabled?: boolean;
  size?: 'S' | 'M' | 'L';
}

const EditButton: React.FC<Props> = (props) => {
  const { onClick, isDisabled = false, size = 'M' } = props;

  const buttonClass = useMemo(() => {
    if (isDisabled) {
      return 'cursor-default bg-primary-1 opacity-25';
    } else {
      return 'cursor-pointer bg-linear-to-br from-primary-1 to-primary-2 hover:bg-linear-to-br hover:from-primary-2 hover:to-primary-1';
    }
  }, [isDisabled]);

  const sizeConfig = useMemo(() => {
    switch (size) {
      case 'S':
        return { buttonClass: 'size-4', iconSize: 12 };
      case 'M':
        return { buttonClass: 'size-6', iconSize: 15 };
      case 'L':
        return { buttonClass: 'size-8', iconSize: 20 };
      default:
        return { buttonClass: 'size-6', iconSize: 15 };
    }
  }, [size]);

  return (
    <button
      suppressHydrationWarning
      className={`${buttonClass} flex ${sizeConfig.buttonClass} min-w-0 items-center justify-center rounded-full p-0`}
      disabled={isDisabled}
      onClick={(e) => {
        if (onClick) onClick();
        e.stopPropagation();
      }}
    >
      <RiPencilFill size={`${sizeConfig.iconSize}px`} color={'white'} />
    </button>
  );
};

export default EditButton;
