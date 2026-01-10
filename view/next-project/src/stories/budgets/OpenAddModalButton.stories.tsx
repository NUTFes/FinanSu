import { OpenAddModalButton } from '@components/budgets';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof OpenAddModalButton> = {
  title: 'FinanSu/budgets/OpenAddModalButton',
  component: OpenAddModalButton,
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
