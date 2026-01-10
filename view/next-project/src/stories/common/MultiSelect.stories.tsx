import { MultiSelect } from '@components/common';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof MultiSelect> = {
  title: 'FinanSu/common/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    options: [
      {
        value: 'value1',
        label: 'label1',
      },
      {
        value: 'value2',
        label: 'label2',
      },
    ],
    placeholder: 'placeholder',
  },
};
