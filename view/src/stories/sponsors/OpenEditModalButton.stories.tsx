import type { Meta } from '@storybook/react';
import { OpenEditModalButton } from '@components/sponsors';

const meta: Meta<typeof OpenEditModalButton> = {
  title: 'FinanSu/sponsors/OpenEditModalButton',
  component: OpenEditModalButton,
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
