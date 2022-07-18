import React from 'react';
import clsx from 'clsx';
import { RiPencilFill } from 'react-icons/ri';

interface Props {
  onClick?: any;
}

function EditButton(props: Props): JSX.Element {
  return (
    <button className={clsx('w-6 h-6 p-0 min-w-0 rounded-full bg-gradient-to-br from-primary-1 to-primary-2 ')} onClick={props.onClick}>
      <div className={clsx('flex items-center grid justify-items-center')}>
        <RiPencilFill size={'15px'} color={'white'} />
      </div>
    </button>
  );
}

export default EditButton;
