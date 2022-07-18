import React from 'react';
import clsx from 'clsx';
import s from './Card.module.css';

interface Props {
  children?: React.ReactNode;
}

function Card(props: Props): JSX.Element {
  return (
    <div className={clsx('flex justify-center align-center')}>
      <div
        className={clsx(
          'm-10 px-10 shadow-md rounded-lg border border-opacity-10 border-black-300',
        )}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Card;
