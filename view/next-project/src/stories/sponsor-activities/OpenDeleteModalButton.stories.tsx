import { OpenDeleteModalButton } from '@components/sponsor-activities';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof OpenDeleteModalButton> = {
  title: 'FinanSu/sponsor-activities/OpenDeleteModalButton',
  component: OpenDeleteModalButton,
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
