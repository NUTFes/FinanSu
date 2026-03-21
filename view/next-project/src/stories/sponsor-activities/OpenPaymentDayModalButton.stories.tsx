import { OpenPaymentDayModalButton } from '@components/sponsor-activities/legacy-documents';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof OpenPaymentDayModalButton> = {
  title: 'FinanSu/sponsor-activities/OpenPaymentDayModalButton',
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
