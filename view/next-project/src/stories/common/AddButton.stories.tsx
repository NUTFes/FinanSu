import { Meta } from '@storybook/react';
import { AddButton } from '@components/common';

const meta: Meta<typeof AddButton> = {
  title: 'FinanSu/common/AddButton',
  component: AddButton,
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
