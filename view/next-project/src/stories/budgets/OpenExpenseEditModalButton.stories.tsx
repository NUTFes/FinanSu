import { OpenExpenseEditModalButton } from '@components/budgets';

import type { Meta } from '@storybook/react';

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
