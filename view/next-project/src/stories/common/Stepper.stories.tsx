import { Meta } from '@storybook/react';
import { Stepper } from '@components/common';

const meta: Meta<typeof Stepper> = {
  title: 'FinanSu/common/Stepper',
  component: Stepper,
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
