import clsx from 'clsx';
import React, { createContext, useContext, type JSX } from 'react';

interface FormControlContextValue {
  id?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

const FormControlContext = createContext<FormControlContextValue>({});

export const useFormControlContext = () => useContext(FormControlContext);

interface FormControlProps {
  id?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FormControl({
  id,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
  children,
  className,
}: FormControlProps): JSX.Element {
  return (
    <FormControlContext.Provider value={{ id, isRequired, isDisabled, isInvalid }}>
      <div className={clsx('w-full', className)}>{children}</div>
    </FormControlContext.Provider>
  );
}

export default FormControl;
