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

  const iconSize = (): { button: string; icon: string } => {
    switch (size) {
      case 'S':
        return { button: '6', icon: '12' };
      case 'M':
        return { button: '12', icon: '20' };
      case 'L':
        return { button: '24', icon: '30' };
      default:
        return { button: '6', icon: '12' };
    }
  };

  return (
    <button
      suppressHydrationWarning
      className={`${buttonClass}  flex h-${iconSize().button} w-${
        iconSize().button
      } min-w-0  items-center justify-center rounded-full p-0`}
      disabled={isDisabled}
      onClick={(e) => {
        if (onClick) onClick();
        e.stopPropagation();
      }}
    >
      <RiPencilFill size={`${iconSize().icon}px`} color={'white'} />
    </button>
  );
};

export default EditButton;
