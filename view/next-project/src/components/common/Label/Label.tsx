import clsx from 'clsx';
import React, { useMemo } from 'react';

import { LabelProps } from './Label.type';

const Label: React.FC<LabelProps> = (props) => {
  const {
    className,
    children,
    color = 'primary-1',
    padding = 'default',
    corner = 'round',
    isOutline = false,
    ...rest
  } = props;
  const classes = useMemo(() => {
    const colorClass = (() => {
      if (isOutline) {
        return `bg-transparent border border-${color} text-${color}`;
      } else {
        return `bg-${color} text-base-2`;
      }
    })();
    const paddingClass = (() => {
      switch (padding) {
        case 'default':
          return 'py-1 px-2';
        case 'small':
          return 'py-0.5 px-1';
        case 'large':
          return 'py-2 px-4';
        case 'none':
          return '';
      }
    })();
    const cornerClass = (() => {
      switch (corner) {
        case 'round':
          return 'rounded-full';
        case 'square':
          return 'rounded';
      }
    })();
    console.log(color);
    return clsx(
      'flex items-center justify-center font-medium text-xs w-fit',
      colorClass,
      paddingClass,
      cornerClass,
      className,
    );
  }, [className, color, padding, corner, isOutline]);
  return (
    <div className={clsx(classes)} {...rest}>
      {children}
    </div>
  );
};

export default Label;
