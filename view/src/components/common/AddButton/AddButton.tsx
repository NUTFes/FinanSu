import clsx from 'clsx';
import React from 'react';
import { RiAddCircleLine } from 'react-icons/ri';

import { PrimaryButton } from '@components/common';

interface Props {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

function AddButton(props: Props): JSX.Element {
  return (
    <PrimaryButton
      className={clsx(props.className)}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <div className='flex items-center gap-2'>
        <RiAddCircleLine size={20} />
        {props.children}
      </div>
    </PrimaryButton>
  );
}

export default AddButton;
