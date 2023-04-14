import { ReactNode } from 'react';

export interface Column {
  name: ReactNode;
  selector: (row: any) => string;
  sortable: boolean;
  style?: any;
}
