import { Meta } from '@storybook/react';
import { OpenAddModalButton } from '@components/purchasereports';

const meta: Meta<typeof OpenAddModalButton> = {
  title: 'FinanSu/purchasereports/OpenAddModalButton',
  component: OpenAddModalButton,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: <h1>children</h1>,
  },
};
