import { OpenAddPdfDetailModalButton } from '@components/sponsor-activities/legacy-documents';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof OpenAddPdfDetailModalButton> = {
  title: 'FinanSu/sponsor-activities/OpenAddPdfDetailModalButton',
  component: OpenAddPdfDetailModalButton,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    className: 'm-10',
    children: <h1>children</h1>,
  },
};
