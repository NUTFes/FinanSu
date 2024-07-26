import { Meta } from '@storybook/react';
import { Title } from '@components/common';

const meta: Meta<typeof Title> = {
  title: 'FinanSu/common/Title',
  component: Title,
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
