import type { Meta } from '@storybook/react';
import { OpenAddModalButton } from '@components/yearperiods';

const meta: Meta<typeof OpenAddModalButton> = {
  title: 'FinanSu/yearperiods/OpenAddModalButton',
  component: OpenAddModalButton,
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
