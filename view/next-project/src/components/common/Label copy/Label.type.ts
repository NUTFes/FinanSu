import { Color } from '@type/color.type';
import { ReactNode } from 'react';

export type LabelProps = {
  children: ReactNode;
  isOutline?: boolean;
  color?: Color;
  padding?: 'default' | 'none' | 'small' | 'large';
  corner?: 'square' | 'round';
} & Omit<JSX.IntrinsicElements['span'], 'color'>;
