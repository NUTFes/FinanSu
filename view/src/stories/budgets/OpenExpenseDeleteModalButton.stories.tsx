import { OpenExpenseDeleteModalButton } from '@components/budgets';

import type { Meta } from '@storybook/react';

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
