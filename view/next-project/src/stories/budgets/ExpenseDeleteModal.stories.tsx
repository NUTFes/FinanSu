import { ExpenseDeleteModal } from '@components/budgets';
import { ModalProps } from '@components/budgets/ExpenseDeleteModal';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof ExpenseDeleteModal> = {
  title: 'FinanSu/budgets/ExpenseDeleteModal',
  component: ExpenseDeleteModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<ModalProps> = (args) => <ExpenseDeleteModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  setShowModal: () => {
    // Add your implementation here
  },
};
