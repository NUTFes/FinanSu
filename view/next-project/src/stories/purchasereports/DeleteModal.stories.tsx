import { Meta } from '@storybook/react';
import { DeleteModal } from '@components/purchasereports';

const meta: Meta<typeof DeleteModal> = {
  title: 'FinanSu/purchasereports/DeleteModal',
  component: DeleteModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: <h1>children</h1>,
  },
};
