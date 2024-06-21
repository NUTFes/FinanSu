import { Meta } from '@storybook/react';
import { RegistButton } from '@components/common';
const meta: Meta<typeof RegistButton> = {
  title: 'FinanSu/RegistButton',
  component: RegistButton,
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
