import clsx from 'clsx';
import React, { InputHTMLAttributes, forwardRef } from 'react';

import s from './Input.module.css';

export interface Props {
  className?: string;
  placeholder?: string;
  id: InputHTMLAttributes<HTMLInputElement>['id'];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  type?: string;
  datalist?: {
    key: string;
    data: { id: number; name: string }[];
  };
}

const InputImage = forwardRef<HTMLInputElement, Props>(({ onChange, id }, ref) => {
  const className = 'rounded-full border border-primary-1 py-2 px-4';
  return (
    <div>
      <input ref={ref} id={id} type='file' accept='image/*' onChange={onChange} />
    </div>
  );
});

export default InputImage;
