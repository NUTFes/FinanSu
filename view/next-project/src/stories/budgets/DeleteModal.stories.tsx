import { Meta } from '@storybook/react';
import { DeleteModal } from '@components/budgets';

const meta: Meta<typeof DeleteModal> = {
  title: 'FinanSu/budgets/DeleteModal',
  component: DeleteModal,
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
