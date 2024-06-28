import { Meta } from '@storybook/react';
import React from 'react';
import { RecoilRoot } from 'recoil';
import AddModal from '../components/fund_information/AddModal';

// Add your required props here for testing
const sampleProps = {
  setShowModal: () => {},
  teachers: [], // Add sample data as needed
  departments: [], // Add sample data as needed
  users: [], // Add sample data as needed
  currentUser: {}, // Add sample data as needed
};

const meta: Meta<typeof AddModal> = {
  title: 'FinanSu/fund_information/AddModal',
  component: AddModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    ...sampleProps,
  },
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
};
