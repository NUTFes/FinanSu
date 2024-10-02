import { Meta, StoryFn } from '@storybook/react';
import { SetStateAction } from 'react';
import EditModal from '@components/teacher/EditModal';
import { Teacher, Department } from '@type/common';

export default {
  title: 'FinanSu/teacher/EditModal',
  component: EditModal,
  argTypes: {},
} as Meta<typeof EditModal>;

const sampleTeacher: Teacher = {
  id: 123,
  name: '小笠原優心',
  position: '准教授',
  departmentID: 123,
  room: 'string',
  isBlack: true,
  remark: 'test',
  isDeleted: false,
  createdAt: '2021-01-01T00:00:00',
  updatedAt: '2021-01-01T00:00:00',
};

const sampleDepartments: Department[] = [
  {
    id: 123,
    name: '情報工学科',
  },
  {
    id: 124,
    name: '機械工学科',
  },
];

export const Primary: StoryFn<typeof EditModal> = (args) => <EditModal {...args} />;
Primary.args = {
  id: 123,
  teacher: sampleTeacher,
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
