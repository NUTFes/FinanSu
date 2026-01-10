import { Input } from '@components/common';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof Input> = {
  title: 'FinanSu/common/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    placeholder: 'placeholder',
    id: 0,
    value: 100,
    type: 'text',
  },
};
