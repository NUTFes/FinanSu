import type { Meta, StoryFn } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { PURCHASE_ITEM } from '../constants';
import { PurchaseReportConfirmModal } from '@components/purchasereports';

const meta: Meta<typeof PurchaseReportConfirmModal> = {
  title: 'FinanSu/purchasereports/PurchaseReportConfirmModal',
  component: PurchaseReportConfirmModal,
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

const Template: StoryFn<typeof PurchaseReportConfirmModal> = (args) => (
  <PurchaseReportConfirmModal {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  purchaseReportId: 0,
  formDataList: [PURCHASE_ITEM],
  isOpen: true,
};
