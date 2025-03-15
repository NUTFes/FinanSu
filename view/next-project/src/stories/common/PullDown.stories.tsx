import { Meta } from '@storybook/react';
import { PullDown } from '@components/common';

const meta: Meta<typeof PullDown> = {
  title: 'FinanSu/common/PullDown',
  component: PullDown,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    placeholder: 'placeholder',
    value: 'value',
    children: 'children',
  },
};
