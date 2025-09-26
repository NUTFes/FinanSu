import type { Meta, StoryFn } from '@storybook/react';
import BudgetEditModal, { BudgetProps } from '@components/budgets/EditModal';

const meta: Meta<typeof BudgetEditModal> = {
  title: 'FinanSu/budgets/EditModal',
  component: BudgetEditModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<BudgetProps> = (args) => <BudgetEditModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  setShowModal: () => {
    // Add your implementation here
  },
  openModal: true,
  id: 1,
  years: [
    { id: 1, year: 2023 },
    { id: 2, year: 2024 },
  ],
  sources: [
    { id: 1, name: 'Salary' },
    { id: 2, name: 'Investment' },
  ],
};
