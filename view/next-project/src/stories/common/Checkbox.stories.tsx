import { Meta } from '@storybook/react';
import { Checkbox } from '@components/common';

const meta: Meta<typeof Checkbox> = {
  title: 'FinanSu/common/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    placeholder: 'placeholder',
    value: 0,
    checked: true,
    disabled: true,
  },
};
