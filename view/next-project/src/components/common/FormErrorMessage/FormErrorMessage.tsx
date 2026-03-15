import clsx from 'clsx';
import React, { type JSX } from 'react';

interface FormErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

function FormErrorMessage({ children, className }: FormErrorMessageProps): JSX.Element {
  return (
    <p className={clsx('mt-1 text-sm text-accent-1', className)} role='alert'>
      {children}
    </p>
  );
}

export default FormErrorMessage;
