import { Meta, StoryFn } from '@storybook/react';
import { ExpenseAddModal } from '@components/budgets';
import { ModalProps } from '@components/budgets/ExpenseAddModal';

const meta: Meta<typeof ExpenseAddModal> = {
  title: 'FinanSu/budgets/ExpenseAddModal',
  component: ExpenseAddModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<ModalProps> = (args) => <ExpenseAddModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  setIsOpen: () => {
    // Add your implementation here
  },
  years: [
    { id: 1, year: 2023 },
    { id: 2, year: 2024 },
  ],
};
