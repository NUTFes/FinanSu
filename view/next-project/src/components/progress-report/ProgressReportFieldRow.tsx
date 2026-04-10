import { FormControl, FormErrorMessage, FormLabel } from '@/components/common';

import type { ReactNode } from 'react';


interface ProgressReportFieldRowProps {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
}

export default function ProgressReportFieldRow({
  id,
  label,
  required = false,
  children,
  error,
}: ProgressReportFieldRowProps) {
  return (
    <FormControl
      id={id}
      isRequired={required}
      isInvalid={Boolean(error)}
      className='grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4'
    >
      <FormLabel className='mb-0 text-right text-base text-[#666666]'>{label}</FormLabel>
      <div>
        {children}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </div>
    </FormControl>
  );
}
