import { DetailEditModal } from '@components/purchasereports';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof DetailEditModal> = {
  title: 'FinanSu/purchasereports/DetailEditModal',
  component: DetailEditModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: <h1>children</h1>,
  },
};
