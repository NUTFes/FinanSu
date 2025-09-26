import type { Meta } from '@storybook/react';
import { OpenExpenditureAddModalButton } from '@components/budgets';

const meta: Meta<typeof OpenExpenditureAddModalButton> = {
  title: 'FinanSu/budgets/OpenExpenditureAddModalButton',
  component: OpenExpenditureAddModalButton,
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
