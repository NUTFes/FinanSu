import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

function PrimaryButton(props: Props): JSX.Element {
  const className =
    'px-4 py-2 text-white-0 font-bold text-md rounded-lg bg-gradient-to-br from-primary-1 to-primary-2 hover:bg-gradient-to-br hover:from-primary-2 hover:to-primary-1' +
    (props.className ? ` ${props.className}` : '') +
    (props.disabled ? ' cursor-not-allowed opacity-20' : '');
  return (
    <button className={clsx(className)} onClick={props.onClick} type={props.type} disabled={props.disabled}>
      <div className={clsx('flex items-center')}>{props.children}</div>
    </button>
  );
}

export default PrimaryButton;
