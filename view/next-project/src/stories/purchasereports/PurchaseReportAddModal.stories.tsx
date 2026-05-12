import { PurchaseReportAddModal } from '@components/purchasereports';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof PurchaseReportAddModal> = {
  title: 'FinanSu/purchasereports/PurchaseReportAddModal',
  component: PurchaseReportAddModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof PurchaseReportAddModal> = (args) => (
  <PurchaseReportAddModal {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
};
