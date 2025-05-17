import { AddModal } from '@components/purchasereports';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof AddModal> = {
  title: 'FinanSu/purchasereports/AddModal',
  component: AddModal,
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
