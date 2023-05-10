import clsx from 'clsx';
import React from 'react';

interface Props {
  w?: string;
  children?: React.ReactNode;
}

function Card(props: Props): JSX.Element {
  return (
    <div className={clsx('md:mx-auto', props.w ? props.w : 'md:w-4/5')}>
      <div
        className={clsx(
          '-mx-10 mr-2 m-2 absolute md:m-10 rounded-lg border border-black-300 border-opacity-10 px-10 shadow-md',
        )}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Card;
