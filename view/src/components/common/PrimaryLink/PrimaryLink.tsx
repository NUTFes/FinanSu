import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

function PrimaryLink(props: Props): JSX.Element {
  const className =
    'flex items-center w-fit justify-center px-4 py-2 text-white-0 font-bold text-md rounded-lg bg-gradient-to-br from-primary-1 to-primary-2 hover:bg-gradient-to-br hover:from-primary-2 hover:to-primary-1' +
    (props.className ? ` ${props.className}` : '');
  return (
    <a className={clsx(className)} href={props.href}>
      <div className={clsx('flex items-center')}>{props.children}</div>
    </a>
  );
}

export default PrimaryLink;
