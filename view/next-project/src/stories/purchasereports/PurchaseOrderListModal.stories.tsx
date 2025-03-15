import type { Meta } from '@storybook/react';
import { PurchaseOrderListModal } from '@components/purchasereports';

const meta: Meta<typeof PurchaseOrderListModal> = {
  title: 'FinanSu/purchasereports/PurchaseOrderListModal',
  component: PurchaseOrderListModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: <h1>children</h1>,
  },
};
