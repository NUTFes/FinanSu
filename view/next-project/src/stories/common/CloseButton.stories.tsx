import type { Meta } from '@storybook/react';
import { CloseButton } from '@components/common';

const meta: Meta<typeof CloseButton> = {
  title: 'FinanSu/common/CloseButton',
  component: CloseButton,
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
