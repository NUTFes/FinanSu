import { Meta } from '@storybook/react';
import { OpenModalButton } from '@components/common';

const meta: Meta<typeof OpenModalButton> = {
  title: 'FinanSu/common/OpenModalButton',
  component: OpenModalButton,
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
