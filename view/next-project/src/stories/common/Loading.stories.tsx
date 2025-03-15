import { Meta } from '@storybook/react';
import { Loading } from '@components/common';

const meta: Meta<typeof Loading> = {
  title: 'FinanSu/common/Loading',
  component: Loading,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    text: '読み込み中',
  },
};
