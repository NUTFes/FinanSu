import React from 'react';
import clsx from 'clsx';
import s from './Input.module.css';

interface Props {
  className?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: any;
  children?: React.ReactNode;
}

function Input(props: Props): JSX.Element {
  const className =
    'rounded-full border border-primary-1 p-2' + (props.className ? ` ${props.className}` : '');
  return (
    <input
      className={clsx(s.input, className)}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    >
      {props.children}
    </input>
  );
}

export default Input;
