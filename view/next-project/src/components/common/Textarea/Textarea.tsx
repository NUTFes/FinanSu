import React from 'react';
import clsx from 'clsx';
import s from './Textarea.module.css';

interface Props {
  className?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: any;
  children?: React.ReactNode;
}

function Textarea(props: Props): JSX.Element {
  const className =
    'rounded-3xl h-32 border border-primary-1 py-2 px-4' + (props.className ? ` ${props.className}` : '');
  return (
    <textarea
      className={clsx(s.textarea, className)}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    >
      {props.children}
    </textarea>
  );
}

export default Textarea;
