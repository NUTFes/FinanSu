import { Meta } from '@storybook/react';
import { DeleteModal } from '@components/teacher';

const meta: Meta<typeof DeleteModal> = {
  title: 'FinanSu/teacher/DeleteModal',
  component: DeleteModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    className: 'm-10',
    children: <h1>children</h1>,
  },
};
