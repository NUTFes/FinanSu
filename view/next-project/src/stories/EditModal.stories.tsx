import { Meta } from '@storybook/react';
import React from 'react';
import { RecoilRoot } from 'recoil';
import EditModal from '../components/fund_information/EditModal';

// Sample props for testing
const sampleProps = {
  setShowModal: () => {},
  teachers: [
    { id: 1, name: 'Teacher 1', departmentID: 1 },
    { id: 2, name: 'Teacher 2', departmentID: 2 },
  ],
  users: [
    { id: 1, name: 'User 1', bureauID: 1 },
    { id: 2, name: 'User 2', bureauID: 2 },
  ],
  departments: [
    { id: 1, name: 'Department 1' },
    { id: 2, name: 'Department 2' },
  ],
  fundInformation: {
    id: 1,
    userID: 1,
    teacherID: 1,
    price: 1000,
    remark: 'Sample remark',
    isFirstCheck: false,
    isLastCheck: false,
    receivedAt: '2023-01-01',
  },
};

const meta: Meta<typeof EditModal> = {
  title: 'FinanSu/fund_information/EditModal',
  component: EditModal,
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
