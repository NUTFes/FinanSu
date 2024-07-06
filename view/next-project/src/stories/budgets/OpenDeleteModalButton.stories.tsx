import { Meta } from '@storybook/react';
import { OpenDeleteModalButton } from '@components/budgets';

const meta: Meta<typeof OpenDeleteModalButton> = {
  title: 'FinanSu/budgets/OpenDeleteModalButton',
  component: OpenDeleteModalButton,
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
