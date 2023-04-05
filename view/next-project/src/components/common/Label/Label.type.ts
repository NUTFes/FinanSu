import { ReactNode } from 'react';

export type LabelProps = {
  children: ReactNode;
  isOutline?: boolean;
  color?: string;
  padding?: 'default' | 'none' | 'small' | 'large';
  corner?: 'square' | 'round';
} & Omit<JSX.IntrinsicElements['div'], 'color'>;
