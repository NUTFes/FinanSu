import clsx from 'clsx';
import React from 'react';

interface FormErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

function FormErrorMessage({ children, className }: FormErrorMessageProps): JSX.Element {
  return (
    <p className={clsx('text-accent-1 mt-1 text-sm', className)} role='alert'>
      {children}
    </p>
  );
}

export default FormErrorMessage;
