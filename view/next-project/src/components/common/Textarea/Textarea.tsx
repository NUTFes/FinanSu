import clsx from 'clsx';
import React from 'react';

import s from './Textarea.module.css';

interface Props {
  className?: string;
  placeholder?: string;
  id?: string;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>,
  ) => void;
  children?: React.ReactNode;
}

function Textarea(props: Props): JSX.Element {
  const className =
    'rounded-3xl h-32 border border-primary-1 py-2 px-4' +
    (props.className ? ` ${props.className}` : '');
  return (
    <textarea
      className={clsx(s.textarea, className)}
      placeholder={props.placeholder}
      id={props.id}
      value={props.value}
      onChange={props.onChange}
    >
      {props.children}
    </textarea>
  );
}

export default Textarea;
