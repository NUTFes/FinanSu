import { DetailModal } from '@components/purchasereports/';

import { EXPENSES, PURCHASE_REPORT_VIEW } from '../constants';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof DetailModal> = {
  title: 'FinanSu/purchasereports/DetailModal',
  component: DetailModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof DetailModal> = (args) => <DetailModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  id: '123',
  purchaseReportViewItem: PURCHASE_REPORT_VIEW,
  expenses: EXPENSES,
  isDelete: false,
};
