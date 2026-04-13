import { Meta } from '@storybook/react';
import { OpenEditModalButton } from '@components/teacher';

const meta: Meta<typeof OpenEditModalButton> = {
  title: 'FinanSu/teacher/OpenEditModalButton',
  component: OpenEditModalButton,
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
