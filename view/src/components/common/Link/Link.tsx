import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

function Link(props: Props): JSX.Element {
  const className =
    'mt-7 underline hover:text-grey-300' + (props.className ? ` ${props.className}` : '');
  return (
    <a className={clsx(className)} href={props.href}>
      <div className={clsx('flex items-center')}>{props.children}</div>
    </a>
  );
}

export default Link;
