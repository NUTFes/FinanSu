import type { Meta } from '@storybook/react';
import { OutlinePrimaryButton } from '@components/common';

const meta: Meta<typeof OutlinePrimaryButton> = {
  title: 'FinanSu/common/OutlinePrimaryButton',
  component: OutlinePrimaryButton,
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
