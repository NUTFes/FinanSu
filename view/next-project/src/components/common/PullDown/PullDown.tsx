import clsx from 'clsx';
import React from 'react';

import s from './PullDown.module.css';

interface Props {
  className?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
}

function PullDown(props: Props): JSX.Element {
  const className =
    'border border-b-2 border-t-0 border-x-0 border-b-black-300 pl-2 w-full' +
    (props.className ? ` ${props.className}` : '');
  return (
    <div className={clsx(s.customSelect, 'w-75')}>
      <select
        placeholder={props.placeholder}
        className={clsx(s.select, className)}
        value={props.value}
        onChange={props.onChange}
      >
        {props.children}
      </select>
    </div>
  );
}

export default PullDown;
