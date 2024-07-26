import { Meta } from '@storybook/react';
import { RedButton } from '@components/common';

const meta: Meta<typeof RedButton> = {
  title: 'FinanSu/common/RedButton',
  component: RedButton,
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
