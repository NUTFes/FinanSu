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
    <PrimaryButton className={clsx(props.className)} onClick={props.onClick} disabled={props.disabled}>
      <RiAddCircleLine
        size={20}
        style={{
          marginRight: 5,
        }}
      />
      {props.children}
    </PrimaryButton>
  );
}

export default AddButton;
