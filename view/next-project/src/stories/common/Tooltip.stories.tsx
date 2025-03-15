import type { Meta } from '@storybook/react';
import { Tooltip } from '@components/common';

const meta: Meta<typeof Tooltip> = {
  title: 'FinanSu/common/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    className: 'm-10',
    children: 'children',
    text: '説明文',
  },
};
