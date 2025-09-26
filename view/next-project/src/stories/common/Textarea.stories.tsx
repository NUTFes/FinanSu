import type { Meta } from '@storybook/react';
import { Textarea } from '@components/common';

const meta: Meta<typeof Textarea> = {
  title: 'FinanSu/common/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: 'children',
    placeholder: 'placeholder',
    id: 'id',
    value: 'サンプルテキストああああああああああああああああああ',
  },
};
