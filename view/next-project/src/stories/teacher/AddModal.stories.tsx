import { Meta, StoryFn } from '@storybook/react';
import { SetStateAction } from 'react';
import { AddModal } from '@components/teacher';
import { Department } from '@type/common';

export default {
  title: 'FinanSu/teacher/AddModal',
  component: AddModal,
  argTypes: {},
  tags: ['autodocs'],
} as Meta<typeof AddModal>;

const sampleDepartments: Department[] = [
  {
    id: 0,
    name: '機械工学分野',
  },
  {
    id: 1,
    name: '機械工学科',
  },
];

export const Primary: StoryFn<typeof AddModal> = (args) => <AddModal {...args} />;
Primary.args = {
  departments: sampleDepartments,
  setShowModal: (value: SetStateAction<boolean>) => {
    if (typeof value === 'boolean') {
      console.log('Modal is now', value ? 'open' : 'closed');
    } else {
      // value が関数の場合、前の状態を仮定して新しい状態を計算
      const newState = value(false); // ここでの false は仮の前状態
      console.log('Modal is now', newState ? 'open' : 'closed');
    }
  },
};
