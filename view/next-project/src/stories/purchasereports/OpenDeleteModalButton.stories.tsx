import { Meta } from '@storybook/react';
import { OpenDeleteModalButton } from '@components/purchasereports';

const meta: Meta<typeof OpenDeleteModalButton> = {
  title: 'FinanSu/purchasereports/OpenDeleteModalButton',
  component: OpenDeleteModalButton,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: <h1>children</h1>,
  },
};
