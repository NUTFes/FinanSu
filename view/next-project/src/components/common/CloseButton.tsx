import React from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

interface Props {
  onClick?: () => void;
}

export default function CloseButton(props: Props) {
  return (
    <RiCloseCircleLine
      size={'23px'}
      color={'gray'}
      onClick={() => {
        props.onClick && props.onClick();
      }}
    />
  );
}
