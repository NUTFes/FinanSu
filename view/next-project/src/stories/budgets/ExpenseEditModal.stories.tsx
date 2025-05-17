import { ExpenseEditModal } from '@components/budgets';
import { ModalProps } from '@components/budgets/ExpenseEditModal';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof ExpenseEditModal> = {
  title: 'FinanSu/budgets/ExpenseEditModal',
  component: ExpenseEditModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<ModalProps> = (args) => <ExpenseEditModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  setIsOpen: () => {
    // Add your implementation here
  },
  expense: {
    id: 0,
    name: 'JOJO',
    totalPrice: 10,
    yearID: 2024,
    createdAt: 'testcreated',
    updatedAt: 'testupdate',
  },
  expenseId: 0,
};
