import { OpenEditModalButton } from '@components/sponsor-activities';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof OpenEditModalButton> = {
  title: 'FinanSu/sponsor-activities/OpenEditModalButton',
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
