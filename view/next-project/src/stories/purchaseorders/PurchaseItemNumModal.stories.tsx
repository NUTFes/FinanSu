import { RecoilRoot } from 'recoil';

import PurchaseItemNumModal, {
  PurchaseItemNumModalProps,
} from '@components/purchaseorders/PurchaseItemNumModal';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof PurchaseItemNumModal> = {
  title: 'FinanSu/purchaseorders/PurchaseItemNumModal',
  component: PurchaseItemNumModal,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<PurchaseItemNumModalProps> = (args) => <PurchaseItemNumModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  expenses: [], // 必要に応じて適切な配列を設定してください
  expenseByPeriods: [], // 同上
  yearPeriods: [], // 同上
};
