import clsx from 'clsx';
import React, { Children, cloneElement, isValidElement } from 'react';

interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  name?: string;
}

type RadioChildProps = {
  name?: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  value?: string;
};

const isRadioChild = (node: React.ReactNode): node is React.ReactElement<RadioChildProps> => {
  return isValidElement(node) && (node.props as RadioChildProps).value !== undefined;
};

function RadioGroup({ value, onChange, children, className, name }: RadioGroupProps): JSX.Element {
  const groupName = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('flex flex-wrap gap-4', className)} role='radiogroup'>
      {Children.map(children, (child) => {
        if (!isRadioChild(child)) return child;

        return cloneElement(child, {
          name: groupName,
          checked: child.props.value === value,
          onChange,
        });
      })}
    </div>
  );
}

export default RadioGroup;
