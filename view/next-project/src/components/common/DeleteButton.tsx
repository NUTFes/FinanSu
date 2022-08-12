import React from 'react';
import clsx from 'clsx';
import { RiDeleteBinLine } from 'react-icons/ri';

interface Props {
  onClick?: any;
  isDisabled?: boolean;
}

export default function DeleteButton(props: Props) {
  return (
    <>
      {props.isDisabled ? (
        <button className={clsx('w-6 h-6 p-0 min-w-0 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500')} onClick={props.onClick}>
          <div className={clsx('flex items-center grid justify-items-center')}>
            <RiDeleteBinLine size={'15px'} color={'white'} />
          </div>
        </button>
      ) : (
        <button disabled className={clsx('w-6 h-6 p-0 opacity-25 min-w-0 rounded-full bg-gradient-to-br from-red-500 to-red-600')} onClick={props.onClick}>
          <div className={clsx('flex items-center grid justify-items-center')}>
            <RiDeleteBinLine size={'15px'} color={'white'} />
          </div>
        </button>
      )}
    </>
  );
}
