import type { Meta } from '@storybook/react';
import { OpenDeleteModalButton } from '@components/sponsoractivities';

const meta: Meta<typeof OpenDeleteModalButton> = {
  title: 'FinanSu/sponsoractivities/OpenDeleteModalButton',
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
