import { OpenEditModalButton } from '@components/purchasereports';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof OpenEditModalButton> = {
  title: 'FinanSu/purchasereports/OpenEditModalButton',
  component: OpenEditModalButton,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: <h1>children</h1>,
  },
};
