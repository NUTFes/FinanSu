import React from 'react';
import clsx from 'clsx';
import s from './Tooltip.module.css';

interface Props {
  text?: string;
  children?: React.ReactNode;
}

function Tooltip(props: Props): JSX.Element {
  return (
    <div className="relative flex flex-col items-center group">
      {props.children}
      <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex">
        <span className="relative z-10 p-2 text-xs leading-none text-white-0 whitespace-no-wrap bg-black-600 shadow-lg rounded-md">{props.text}</span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-black-600"></div>
      </div>
    </div>
  );
}

export default Tooltip;
