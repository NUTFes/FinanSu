import React from 'react';
import clsx from 'clsx';
import s from './Checkbox.module.css';

interface Props {
  className?: string;
  placeholder?: string;
  value?: string | number;
  checked?: boolean;
  disabled?: boolean;
  onChange?: any;
  children?: React.ReactNode;
}

function Checkbox(props: Props): JSX.Element {
  const className =
    '' + (props.className ? ` ${props.className}` : '');
  return (
    <>
      {props.checked ? (
        <input
          type="checkbox"
          disabled={props.disabled}
          className={clsx(className)}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
        >
          {props.children}
        </input>
      ) : (
        <input
          type="checkbox"
          disabled={props.disabled}
          className={clsx(className)}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
        >
          {props.children}
        </input>
      )}
    </>
  );
}

export default Checkbox;
