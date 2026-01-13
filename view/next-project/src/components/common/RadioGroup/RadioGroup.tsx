import clsx from 'clsx';
import React, { Children, cloneElement, isValidElement } from 'react';

interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  name?: string;
}

function RadioGroup({ value, onChange, children, className, name }: RadioGroupProps): JSX.Element {
  const groupName = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('flex flex-wrap gap-4', className)} role='radiogroup'>
      {Children.map(children, (child) => {
        if (isValidElement(child) && child.props.value !== undefined) {
          return cloneElement(child as React.ReactElement<any>, {
            name: groupName,
            checked: child.props.value === value,
            onChange,
          });
        }
        return child;
      })}
    </div>
  );
}

export default RadioGroup;
