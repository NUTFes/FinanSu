import React from 'react';
import clsx from 'clsx';
import s from './PrimaryButton.module.css';
import { NewButton } from '@components/common';

interface Props {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

function PrimaryButton(props: Props): JSX.Element {
  const className =
    'bg-gradient-to-br from-primary-1 to-primary-2 hover:bg-primary-2' +
    (props.className ? ` ${props.className}` : '');
  return (
    <NewButton className={clsx(className)} onClick={props.onClick}>
      <div className={clsx('flex items-center')}>{props.children}</div>
    </NewButton>
  );
}

export default PrimaryButton;
