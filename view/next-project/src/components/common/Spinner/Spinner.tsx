import clsx from 'clsx';

import type { JSX } from "react";

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  className?: string;
  thickness?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'size-4',
  md: 'size-8',
  lg: 'size-12',
  xl: 'size-[120px]',
};

const thicknessClasses: Record<SpinnerSize, string> = {
  sm: 'border-2',
  md: 'border-3',
  lg: 'border-4',
  xl: 'border-4',
};

const colorClasses: Record<NonNullable<SpinnerProps['color']>, string> = {
  white: 'border-white-0',
  'primary-1': 'border-primary-1',
  'gray-500': 'border-gray-500',
  'red-500': 'border-red-500',
  'blue-500': 'border-blue-500',
  'green-500': 'border-green-500',
};

function Spinner({ size = 'md', color = 'primary-1', className }: SpinnerProps): JSX.Element {
  const borderColorClass = colorClasses[color];

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-solid border-t-transparent',
        sizeClasses[size],
        thicknessClasses[size],
        borderColorClass,
        className,
      )}
      role='status'
      aria-label='Loading'
    >
      <span className='sr-only'>Loading...</span>
    </div>
  );
}

export default Spinner;
