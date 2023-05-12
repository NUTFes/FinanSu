import React, { useMemo } from 'react';
import { RiPencilFill } from 'react-icons/ri';

interface Props {
  onClick?: () => void;
  isDisabled?: boolean;
}

const EditButton: React.FC<Props> = (props) => {
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
      suppressHydrationWarning
      className={`${buttonClass}  flex h-6 w-6 min-w-0  items-center justify-center rounded-full p-0`}
      disabled={isDisabled}
      onClick={(e) => {
        if (onClick) onClick();
        e.stopPropagation();
      }}
    >
      <RiPencilFill size={'15px'} color={'white'} />
    </button>
  );
};

export default EditButton;
