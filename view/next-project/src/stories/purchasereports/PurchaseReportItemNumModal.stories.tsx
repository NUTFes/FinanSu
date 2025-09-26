import type { Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { PurchaseReportItemNumModal } from '@components/purchasereports';

const meta: Meta<typeof PurchaseReportItemNumModal> = {
  title: 'FinanSu/purchasereports/PurchaseReportItemNumModal',
  component: PurchaseReportItemNumModal,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    children: <h1>children</h1>,
  },
};
