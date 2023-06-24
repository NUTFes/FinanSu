import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
  children?: React.ReactNode;
  title?: string;
}

export default function Title(props: Props) {
  const className =
    'text-2xl leading-8 font-thin tracking-widest gap-5 flex items-center justify-center' +
    (props.className ? ` ${props.className}` : '');

  return (
    <div className={clsx(className)}>
      {props.title}
      {props.children}
    </div>
  );
}
