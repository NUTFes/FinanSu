import { Meta, StoryFn } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { DetailModal, ModalProps } from '@components/purchaseorders/';

const meta: Meta = {
  title: 'FinanSu/purchaseorders/DetailModal',
  component: DetailModal,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    // 特定のPropsに対する設定が必要な場合はここに追加
  },
};

export default meta;

const Template: StoryFn<typeof ModalProps> = (args) => <DetailModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  id: '123',
  purchaseOrderViewItem: {
    purchaseOrder: {
      id: '12345', // 適切なidを設定
      expenseID: '123', // 必要に応じて調整
      createdAt: new Date().toISOString(), // 現在の日付のISO文字列
      deadline: new Date().toISOString(), // 現在の日付のISO文字列
    },
    purchaseItem: [], // 購入項目の配列、必要に応じて詳細を追加
  },
  expenses: [
    {
      id: '123',
      name: 'オフィス用品',
    },
  ],
  isDelete: false,
};
