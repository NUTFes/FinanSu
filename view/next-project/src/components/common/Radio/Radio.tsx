import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
  value?: string | number;
  checked?: boolean;
  onClick?: any;
  onChange?: any;
  children?: React.ReactNode;
}

function Radio(props: Props): JSX.Element {
  const className = '' + (props.className ? ` ${props.className}` : '');
  return (
    <input
      type='radio'
      name='radio'
      checked={props.checked}
      className={clsx(className)}
      value={props.value}
      onClick={props.onClick}
      onChange={props.onChange}
    >
      {props.children}
    </input>
  );
}

export default Radio;
