import type { Meta } from '@storybook/react';
import { UnderlinePrimaryButton } from '@components/common';

const meta: Meta<typeof UnderlinePrimaryButton> = {
  title: 'FinanSu/common/UnderlinePrimaryButton',
  component: UnderlinePrimaryButton,
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
