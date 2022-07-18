import React from 'react';
import clsx from 'clsx';
import s from './AddButton.module.css';
import { PrimaryButton } from '@components/common';
import { RiAddCircleLine } from 'react-icons/ri';

interface Props {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

function AddButton(props: Props): JSX.Element {
  return (
    <PrimaryButton className={clsx(props.className)} onClick={props.onClick}>
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
