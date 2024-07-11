import { Meta, StoryFn } from '@storybook/react';
import ExpenditureAddModal, { ModalProps } from '@components/budgets/ExpenditureAddModal';

const meta: Meta<typeof ExpenditureAddModal> = {
  title: 'FinanSu/budgets/ExpenditureAddModal',
  component: ExpenditureAddModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<ModalProps> = (args) => <ExpenditureAddModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  setShowModal: () => {
    // Add your implementation here
  },
  years: [
    { id: 1, year: 2023 },
    { id: 2, year: 2024 },
  ],
};
