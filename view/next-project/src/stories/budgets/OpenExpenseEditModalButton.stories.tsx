import { Meta } from '@storybook/react';
import { OpenExpenseEditModalButton } from '@components/budgets';

const meta: Meta<typeof OpenExpenseEditModalButton> = {
  title: 'FinanSu/budgets/OpenExpenseEditModalButton',
  component: OpenExpenseEditModalButton,
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
