import { SearchSelect } from '@components/common';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof SearchSelect> = {
  title: 'FinanSu/common/SearchSelect',
  component: SearchSelect,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: 'children',
    value: [
      {
        value: 'value1',
        label: 'label1',
      },
      {
        value: 'value2',
        label: 'label2',
      },
    ],
    noOptionMessage: 'noOptionMessage',
    placeholder: 'placeholder',
  },
};
