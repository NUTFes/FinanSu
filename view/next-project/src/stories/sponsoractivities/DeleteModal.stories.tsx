import type { Meta } from '@storybook/react';
import { DeleteModal } from '@components/sponsoractivities';

const meta: Meta<typeof DeleteModal> = {
  title: 'FinanSu/sponsoractivities/DeleteModal',
  component: DeleteModal,
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
