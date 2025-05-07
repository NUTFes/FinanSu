import React from 'react';

interface Props {
  text?: string;
  children?: React.ReactNode;
}

function Tooltip(props: Props): JSX.Element {
  return (
    <div className='group relative flex flex-col items-center'>
      {props.children}
      <div className='absolute bottom-0 mb-6 flex hidden flex-col items-center group-hover:flex'>
        <span className='whitespace-no-wrap relative z-10 rounded-md bg-black-600 p-2 text-xs leading-none text-white-0 shadow-lg'>
          {props.text}
        </span>
        <div className='-mt-2 size-3 rotate-45 bg-black-600'></div>
      </div>
    </div>
  );
}

export default Tooltip;
