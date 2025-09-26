import type { Meta, StoryFn } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { PURCHASE_REPORT_VIEW, EXPENSES } from '../constants';
import { DetailModal } from '@components/purchasereports/';

const meta: Meta<typeof DetailModal> = {
  title: 'FinanSu/purchasereports/DetailModal',
  component: DetailModal,
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

const Template: StoryFn<typeof DetailModal> = (args) => <DetailModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  id: '123',
  purchaseReportViewItem: PURCHASE_REPORT_VIEW,
  expenses: EXPENSES,
  isDelete: false,
};
