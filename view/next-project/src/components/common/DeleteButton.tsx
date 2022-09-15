import clsx from 'clsx';
import React from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';

interface Props {
  onClick?: any;
  isDisabled?: boolean;
}

export default function DeleteButton(props: Props) {
  return (
    <>
      {props.isDisabled ? (
        <button
          className={clsx(
            'h-6 w-6 min-w-0 rounded-full bg-gradient-to-br from-red-500 to-red-600 p-0 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500',
          )}
          onClick={props.onClick}
        >
          <div className={clsx('flex grid items-center justify-items-center')}>
            <RiDeleteBinLine size={'15px'} color={'white'} />
          </div>
        </button>
      ) : (
        <button
          disabled
          className={clsx(
            'h-6 w-6 min-w-0 rounded-full bg-gradient-to-br from-red-500 to-red-600 p-0 opacity-25',
          )}
          onClick={props.onClick}
        >
          <div className={clsx('flex grid items-center justify-items-center')}>
            <RiDeleteBinLine size={'15px'} color={'white'} />
          </div>
        </button>
      )}
    </>
  );
}
