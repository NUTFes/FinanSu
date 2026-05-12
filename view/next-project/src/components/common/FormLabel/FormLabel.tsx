import clsx from 'clsx';
import React, { type JSX } from 'react';

import { useFormControlContext } from '../FormControl/FormControl';

interface FormLabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

function FormLabel({ children, className, htmlFor }: FormLabelProps): JSX.Element {
  const { id, isRequired } = useFormControlContext();

  return (
    <label
      htmlFor={htmlFor || id}
      className={clsx('text-black-300 mb-2 block text-sm font-medium', className)}
    >
      {children}
      {isRequired && <span className='text-accent-1 ml-1'>*</span>}
    </label>
  );
}

export default FormLabel;
