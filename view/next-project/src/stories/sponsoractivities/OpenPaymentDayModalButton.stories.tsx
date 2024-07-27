import { Meta } from '@storybook/react';
import { OpenPaymentDayModalButton } from '@components/sponsoractivities';

const meta: Meta<typeof OpenPaymentDayModalButton> = {
  title: 'FinanSu/sponsoractivities/OpenPaymentDayModalButton',
  component: OpenPaymentDayModalButton,
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
