import clsx from 'clsx';
import React, { type JSX } from 'react';

interface Props {
  w?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

function Card(props: Props): JSX.Element {
  return (
    <div className={clsx('mx-auto', props.w ? props.w : 'md:w-4/5')} onClick={props.onClick}>
      <div
        className={clsx(`
          border-opacity-10 m-2 rounded-lg border px-2 shadow-md
          md:m-10 md:px-10
        `)}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Card;
