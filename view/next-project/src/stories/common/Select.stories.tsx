import { Meta } from '@storybook/react';
import { Select } from '@components/common';

const meta: Meta<typeof Select> = {
  title: 'FinanSu/common/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: 'children',
    placeholder: 'placeholder',
    value: '0',
    defaultValue: '1',
  },
};
