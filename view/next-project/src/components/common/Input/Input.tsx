import clsx from 'clsx';
import React from 'react';

import s from './Input.module.css';

interface Props {
  className?: string;
  placeholder?: string;
  id?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  children?: React.ReactNode;
  type?: string;
  datalist?: {
    key: string;
    data: { id: number; name: string }[];
  };
}

function Input(props: Props): JSX.Element {
  const className =
    'rounded-full border border-primary-1 py-2 px-4 w-full' +
    (props.className ? ` ${props.className}` : '');
  return (
    <div>
      <input
        className={clsx(s.input, className)}
        placeholder={props.placeholder}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        type={props.type}
        list={props.datalist?.key}
      >
        {props.children}
      </input>
      {props.datalist && (
        <datalist id={props.datalist.key}>
          {props.datalist.data.map((option) => (
            <option key={option.id} value={option.name} />
          ))}
        </datalist>
      )}
    </div>
  );
}

export default Input;
