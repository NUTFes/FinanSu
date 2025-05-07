import { PrimaryButton } from '@components/common';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof PrimaryButton> = {
  title: 'FinanSu/common/PrimaryButton',
  component: PrimaryButton,
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
