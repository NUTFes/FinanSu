import type { Meta } from '@storybook/react';
import { SponsorAddModal } from '@components/sponsors';

const meta: Meta<typeof SponsorAddModal> = {
  title: 'FinanSu/sponsors/SponsorAddModal',
  component: SponsorAddModal,
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
