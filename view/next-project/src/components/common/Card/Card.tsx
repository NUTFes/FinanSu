import React from 'react';
import clsx from 'clsx';
import s from './Card.module.css';

interface Props {
  children?: React.ReactNode;
}

function Card(props: Props): JSX.Element {
  return (
    <div className={clsx('mx-auto w-4/5')}>
      <div
        className={clsx(
          'm-10 rounded-lg border border-black-300 border-opacity-10 px-10 shadow-md',
        )}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Card;
