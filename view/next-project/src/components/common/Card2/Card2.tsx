import clsx from 'clsx';
import React from 'react';

interface Props {
  w?: string;
  children?: React.ReactNode;
}

function Card(props: Props): JSX.Element {
  return (
    <div
      className={clsx(
        'm-auto mt-3 mb-2 w-full  border border-opacity-10 px-5 shadow-md rounded-lg md:hidden',
      )}
    >
      {props.children}
    </div>
  );
}

export default Card;
