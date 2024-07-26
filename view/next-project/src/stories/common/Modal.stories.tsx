import { Meta } from '@storybook/react';
import { Modal } from '@components/common';

const meta: Meta<typeof Modal> = {
  title: 'FinanSu/common/Modal',
  component: Modal,
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
