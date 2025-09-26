import type { Meta } from '@storybook/react';
import { OpenExpenseAddModalButton } from '@components/budgets';

const meta: Meta<typeof OpenExpenseAddModalButton> = {
  title: 'FinanSu/budgets/OpenExpenseAddModalButton',
  component: OpenExpenseAddModalButton,
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
