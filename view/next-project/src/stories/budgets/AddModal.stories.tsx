import type { Meta, StoryFn } from '@storybook/react';
import { AddModal, ModalProps } from '@components/budgets';

const meta: Meta<typeof AddModal> = {
  title: 'FinanSu/budgets/AddModal',
  component: AddModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof ModalProps> = (args) => <AddModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  setShowModal: () => {
    // Add your implementation here
  },
  years: [
    { id: 1, year: 2023 },
    { id: 2, year: 2024 },
  ],
  sources: [
    { id: 1, name: 'Salary' },
    { id: 2, name: 'Investment' },
  ],
};
