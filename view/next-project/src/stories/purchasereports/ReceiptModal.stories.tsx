import type { Meta } from '@storybook/react';
import { ReceiptModal } from '@components/purchasereports';

const meta: Meta<typeof ReceiptModal> = {
  title: 'FinanSu/purchasereports/ReceiptModal',
  component: ReceiptModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: <h1>children</h1>,
    purchaseReportId: 1,
  },
};
