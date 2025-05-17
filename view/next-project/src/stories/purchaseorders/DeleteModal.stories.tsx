import { DeleteModal } from '@components/purchaseorders';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof DeleteModal> = {
  title: 'FinanSu/purchaseorders/DeleteModal',
  component: DeleteModal,
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
