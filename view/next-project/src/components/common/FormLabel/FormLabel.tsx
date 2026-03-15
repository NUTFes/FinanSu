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
      className={clsx('mb-2 block text-sm font-medium text-black-300', className)}
    >
      {children}
      {isRequired && <span className='ml-1 text-accent-1'>*</span>}
    </label>
  );
}

export default FormLabel;
