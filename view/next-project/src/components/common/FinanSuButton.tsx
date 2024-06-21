import clsx from 'clsx';
import React from 'react';

interface Props {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'thirdry' | 'Red';
  shape?: 'rounded' | 'pill';
  textAlign?: 'left' | 'center' | 'right';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

function FinanSuButton(props: Props): JSX.Element {
  let sizeClass = '';
  let colorClass = '';
  let shapeClass = '';
  let textAlignClass = '';
  let hoverClass = '';

  switch (props.size) {
    case 'small':
      sizeClass = 'px-4 py-2';
      break;
    case 'medium':
      sizeClass = 'px-6 py-2';
      break;
    case 'large':
      sizeClass = 'px-8 py-2';
      break;
  }

  switch (props.color) {
    case 'primary':
      colorClass = 'bg-gradient-to-br from-primary-1 to-primary-2 text-white-0 font-bold text-md';
      break;
    case 'secondary':
      colorClass = 'bg-primary-2 text-white-0 font-bold text-md';
      break;
    case 'thirdry':
      colorClass = 'bg-primary-3';
      break;
    case 'Red':
      colorClass = 'bg-gradient-to-br from-red-500 to-red-600 text-white-0 font-bold text-md';
      break;
  }

  switch (props.shape) {
    case 'rounded':
      shapeClass = 'rounded-lg';
      break;
    case 'pill':
      shapeClass = 'rounded-full';
      break;
  }

  switch (props.textAlign) {
    case 'left':
      textAlignClass = 'text-left';
      break;
    case 'center':
      textAlignClass = 'text-center';
      break;
    case 'right':
      textAlignClass = 'text-right';
      break;
  }

  switch (props.hover) {
    case true:
      hoverClass = 'hover:bg-gradient-to-br hover:from-primary-2 hover:to-primary-1';
      break;
    case false:
      hoverClass = '';
      break;
  }

  const className = `${sizeClass} ${colorClass} ${shapeClass} ${textAlignClass} ${hoverClass}`;

  return (
    <button className={clsx(className)} onClick={props.onClick}>
      <div className={clsx('flex items-center')}>{props.children}</div>
    </button>
  );
}
export default FinanSuButton;
