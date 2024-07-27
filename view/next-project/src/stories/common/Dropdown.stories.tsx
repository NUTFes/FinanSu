import { Meta } from '@storybook/react';
import { Dropdown } from '@components/common';

const meta: Meta<typeof Dropdown> = {
  title: 'FinanSu/common/Dropdown',
  component: Dropdown,
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
