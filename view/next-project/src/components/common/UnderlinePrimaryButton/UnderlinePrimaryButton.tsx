import React from 'react';
import clsx from 'clsx';
import s from './UnderlinePrimaryButton.module.css';

interface Props {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

function UnderlinePrimaryButton(props: Props): JSX.Element {
  const className =
    'px-3 py-1 text-primary-1 font-bold text-md bg-white-0 border border-t-white-0 border-x-white-0 border-b-primary-1 hover:bg-white-100 hover:text-primary-2 hover:border-b-primary-2' +
    (props.className ? ` ${props.className}` : '');
  return (
    <button className={clsx(className)} onClick={props.onClick}>
      <div className={clsx('flex items-center')}>{props.children}</div>
    </button>
  );
}

export default UnderlinePrimaryButton;
