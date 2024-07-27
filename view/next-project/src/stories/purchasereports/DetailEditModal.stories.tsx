import { Meta } from '@storybook/react';
import { DetailEditModal } from '@components/purchasereports';

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
