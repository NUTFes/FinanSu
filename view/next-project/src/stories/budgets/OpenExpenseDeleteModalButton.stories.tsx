import { Meta } from '@storybook/react';
import { OpenExpenseDeleteModalButton } from '@components/budgets';

const meta: Meta<typeof OpenExpenseDeleteModalButton> = {
  title: 'FinanSu/budgets/OpenExpenseDeleteModalButton',
  component: OpenExpenseDeleteModalButton,
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
