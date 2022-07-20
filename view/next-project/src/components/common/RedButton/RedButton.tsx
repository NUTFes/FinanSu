import React from 'react';
import clsx from 'clsx';
import s from './RedButton.module.css';
import { Button } from '@components/common';

interface Props {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

function RedButton(props: Props): JSX.Element {
  const className =
    'bg-gradient-to-br from-red-500 to-red-600 hover:bg-red-600' +
    (props.className ? ` ${props.className}` : '');
  return (
    <Button className={clsx(className)} onClick={props.onClick}>
      <div className={clsx('flex items-center')}>{props.children}</div>
    </Button>
  );
}

export default RedButton;
