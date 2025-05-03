import React from 'react';

interface Props {
  className?: string;
  placeholder?: string;
  value?: string | number;
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
  children?: React.ReactNode;
}

function Checkbox(props: Props): JSX.Element {
  const className = '' + (props.className || '');
  return (
    <input
      type='checkbox'
      checked={props.checked}
      disabled={props.disabled}
      className={className}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    >
      {props.children}
    </input>
  );
}

export default Checkbox;
