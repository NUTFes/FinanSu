import clsx from 'clsx';
import React from 'react';


interface Props {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

function RedButton(props: Props): JSX.Element {
  const className =
    'px-4 py-2 text-white-0 font-bold text-md rounded-lg bg-gradient-to-br from-red-500 to-red-600 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500' +
    (props.className ? ` ${props.className}` : '');
  return (
    <button className={clsx(className)} onClick={props.onClick}>
      <div className={clsx('flex items-center')}>{props.children}</div>
    </button>
  );
}

export default RedButton;
