import clsx from 'clsx';
import React from 'react';
import { RiPencilFill } from 'react-icons/ri';

interface Props {
  onClick?: () => void;
  isDisabled?: boolean;
}

function EditButton(props: Props): JSX.Element {
  return (
    <>
      {props.isDisabled ? (
        <button
          className={clsx(
            'h-6 w-6 min-w-0 rounded-full bg-gradient-to-br from-primary-1 to-primary-2 p-0 hover:bg-gradient-to-br hover:from-primary-2 hover:to-primary-1',
          )}
          onClick={props.onClick}
        >
          <div className={clsx('flex grid items-center justify-items-center')}>
            <RiPencilFill size={'15px'} color={'white'} />
          </div>
        </button>
      ) : (
        <button
          disabled
          className={clsx(
            'h-6 w-6 min-w-0 rounded-full bg-gradient-to-br from-primary-1 to-primary-2 p-0 opacity-25',
          )}
          onClick={props.onClick}
        >
          <div className={clsx('flex grid items-center justify-items-center')}>
            <RiPencilFill size={'15px'} color={'white'} />
          </div>
        </button>
      )}
    </>
  );
}

export default EditButton;
