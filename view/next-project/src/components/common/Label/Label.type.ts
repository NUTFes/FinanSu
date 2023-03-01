import { ReactNode } from 'react';

import { Color } from '@type/color.type';

export type LabelProps = {
  children: ReactNode;
  isOutline?: boolean;
  color?: Color;
  padding?: 'default' | 'none' | 'small' | 'large';
  corner?: 'square' | 'round';
} & Omit<JSX.IntrinsicElements['div'], 'color'>;
