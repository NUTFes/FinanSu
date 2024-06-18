import { Meta } from '@storybook/react';
import { LoadingButton } from '@components/common';

const meta: Meta<typeof LoadingButton> = {
  title: 'FinanSu/LoadingButton',
  component: LoadingButton,
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
