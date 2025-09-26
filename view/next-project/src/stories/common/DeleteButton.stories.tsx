import type { Meta } from '@storybook/react';
import { DeleteButton } from '@components/common';

const meta: Meta<typeof DeleteButton> = {
  title: 'FinanSu/common/DeleteButton',
  component: DeleteButton,
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
