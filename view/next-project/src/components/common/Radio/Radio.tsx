import React from 'react';
import clsx from 'clsx';
import s from './Radio.module.css';

interface Props {
  className?: string;
  value?: string | number;
  onChange?: any;
  children?: React.ReactNode;
}

function Radio(props: Props): JSX.Element {
  const className =
    '' + (props.className ? ` ${props.className}` : '');
  return (
    <input
      type="radio"
      name="radio"
      className={clsx(className)}
      value={props.value}
      onChange={props.onChange}
    >
      {props.children}
    </input>
  );
}

export default Radio;
