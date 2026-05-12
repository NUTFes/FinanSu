import { PurchaseReportItemNumModal } from '@components/purchasereports';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof PurchaseReportItemNumModal> = {
  title: 'FinanSu/purchasereports/PurchaseReportItemNumModal',
  component: PurchaseReportItemNumModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: <h1>children</h1>,
  },
};
