import clsx from 'clsx';
import React from 'react';

import s from './Input.module.css';

interface Props {
  className?: string;
  placeholder?: string;
  id?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  type?: string;
  datalist?: { id: number; name: string }[];
  listKey?: string;
  enableDatalist?: boolean;
}

function Input(props: Props): JSX.Element {
  const className =
    'rounded-full border border-primary-1 py-2 px-4' +
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
        list={props.enableDatalist ? props.listKey : undefined}
      >
        {props.children}
      </input>
      {props.enableDatalist && (
        <datalist id={props.listKey}>
          {props.datalist?.map((option) => (
            <option key={option.id} value={option.name} />
          ))}
        </datalist>
      )}
    </div>

  );
}

export default Input;
