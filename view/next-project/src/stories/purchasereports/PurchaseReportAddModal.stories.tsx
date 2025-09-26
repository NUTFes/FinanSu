import type { Meta, StoryFn } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { PurchaseReportAddModal } from '@components/purchasereports';

const meta: Meta<typeof PurchaseReportAddModal> = {
  title: 'FinanSu/purchasereports/PurchaseReportAddModal',
  component: PurchaseReportAddModal,
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

const Template: StoryFn<typeof PurchaseReportAddModal> = (args) => (
  <PurchaseReportAddModal {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
};
