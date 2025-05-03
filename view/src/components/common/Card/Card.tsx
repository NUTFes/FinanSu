import clsx from 'clsx';
import React from 'react';

interface Props {
  w?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

function Card(props: Props): JSX.Element {
  return (
    <div className={clsx('mx-auto', props.w ? props.w : 'md:w-4/5')} onClick={props.onClick}>
      <div
        className={clsx(
          'm-2 rounded-lg border border-black-300 border-opacity-10 px-2 shadow-md md:m-10 md:px-10',
        )}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Card;
