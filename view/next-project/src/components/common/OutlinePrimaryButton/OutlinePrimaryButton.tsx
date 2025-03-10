import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

function PrimaryButton(props: Props): JSX.Element {
  const className =
    'flex justify-center px-4 py-2 text-primary-1 font-bold text-md rounded-lg bg-white-0 border border-primary-1 hover:bg-white-100 hover:text-primary-2 hover:border-primary-2' +
    (props.className ? ` ${props.className}` : '');
  return (
    <button className={clsx(className)} onClick={props.onClick}>
      <div className={clsx('flex items-center')}>{props.children}</div>
    </button>
  );
}

export default PrimaryButton;
