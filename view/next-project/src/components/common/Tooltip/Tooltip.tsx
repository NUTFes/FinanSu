import React, { type JSX } from 'react';

interface Props {
  text?: string;
  label?: string;
  hasArrow?: boolean;
  children?: React.ReactNode;
}

function Tooltip(props: Props): JSX.Element {
  const tooltipText = props.label || props.text;

  return (
    <div className='group relative flex flex-col items-center'>
      {props.children}
      <div className='absolute bottom-0 mb-6 hidden flex-col items-center group-hover:flex'>
        <span className='whitespace-no-wrap bg-black-600 text-white-0 relative z-10 rounded-md p-2 text-xs leading-none shadow-lg'>
          {tooltipText}
        </span>
        <div className='bg-black-600 -mt-2 size-3 rotate-45'></div>
      </div>
    </div>
  );
}

export default Tooltip;
