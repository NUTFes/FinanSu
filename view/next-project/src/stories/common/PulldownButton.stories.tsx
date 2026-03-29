import PulldownButton from '@/components/common/PulldownButton';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof PulldownButton> = {
  title: 'FinanSu/common/PulldownButton',
  component: PulldownButton,
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
