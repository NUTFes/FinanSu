import { PrimaryLink } from '@components/common';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof PrimaryLink> = {
  title: 'FinanSu/common/PrimaryLink',
  component: PrimaryLink,
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
