import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function Modal(props: Props) {
  const className =
    'relative sm:my-6 mx-auto bg-white-0 rounded-lg p-5' +
    (props.className ? ` ${props.className}` : '');

  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-300/50 outline-none focus:outline-none'>
        <div className={clsx(className)} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          {props.children}
        </div>
      </div>
    </>
  );
}
