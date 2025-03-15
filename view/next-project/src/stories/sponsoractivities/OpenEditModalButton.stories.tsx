import { Meta } from '@storybook/react';
import { OpenEditModalButton } from '@components/sponsoractivities';

const meta: Meta<typeof OpenEditModalButton> = {
  title: 'FinanSu/sponsoractivities/OpenEditModalButton',
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
