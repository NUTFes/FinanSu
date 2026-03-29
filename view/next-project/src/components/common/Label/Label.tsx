import clsx from 'clsx';
import React, { useMemo } from 'react';

import { LabelProps } from './Label.type';

const Label: React.FC<LabelProps> = (props) => {
  const {
    children,
    color = 'primary-1',
    padding = 'default',
    corner = 'round',
    isOutline = false,
  } = props;

  const bgColor = useMemo(() => {
    if (isOutline) {
      return 'bg-transparent';
    }
    return `bg-${color}`;
  }, [color, isOutline]);

  const borderColor = useMemo(() => {
    if (isOutline) {
      return `border-${color}`;
    }
    return 'border-transparent';
  }, [color, isOutline]);

  const textColor = useMemo(() => {
    if (isOutline) {
      return `text-${color}`;
    }
    return 'text-white-0';
  }, [color, isOutline]);

  const paddingValue = useMemo(() => {
    if (padding === 'default') {
      return 'py-1 px-2';
    }
    if (padding === 'small') {
      return 'py-0 px-0';
    }
    if (padding === 'large') {
      return 'py-2 px-4';
    }
    return `py-${padding} px-${padding}`;
  }, [padding]);

  const borderRadius = useMemo(() => {
    if (corner === 'round') {
      return 'rounded-full';
    }
    if (corner === 'square') {
      return 'rounded-none';
    }
    return corner;
  }, [corner]);

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center border text-sm',
        bgColor,
        borderColor,
        textColor,
        paddingValue,
        borderRadius,
      )}
    >
      {children}
    </span>
  );
};

export default Label;
