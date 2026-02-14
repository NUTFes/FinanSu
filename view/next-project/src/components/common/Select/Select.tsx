import clsx from 'clsx';
import React from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';

interface Props {
  className?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
  isDisabled?: boolean;
  id?: string;
}

function Select(props: Props): JSX.Element {
  const {
    className: propsClassName,
    placeholder,
    value,
    defaultValue,
    onChange,
    children,
    isDisabled,
    id,
  } = props;

  const className =
    'rounded-full border border-primary-1 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-1 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50' +
    (propsClassName ? ` ${propsClassName}` : '');

  return (
    <div className='relative w-full'>
      <select
        id={id}
        className={clsx('appearance-none', 'cursor-pointer', className)}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={isDisabled}
      >
        {placeholder && (
          <option value='' disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <div className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500'>
        <RiArrowDropDownLine size={24} />
      </div>
    </div>
  );
}

export default Select;
