import { Meta } from '@storybook/react';
import { OpenAddPdfDetailModalButton } from '@components/sponsoractivities';

const meta: Meta<typeof OpenAddPdfDetailModalButton> = {
  title: 'FinanSu/sponsoractivities/OpenAddPdfDetailModalButton',
  component: OpenAddPdfDetailModalButton,
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
