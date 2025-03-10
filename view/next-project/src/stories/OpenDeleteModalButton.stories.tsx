import type { Meta } from '@storybook/react';
import { OpenAddModalButton } from '@components/fund_information';

const meta: Meta<typeof OpenAddModalButton> = {
  title: 'FinanSu/fund_information/OpenAddModalButton',
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
