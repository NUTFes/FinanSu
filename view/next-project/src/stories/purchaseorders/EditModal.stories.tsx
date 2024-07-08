import { Meta, StoryFn } from '@storybook/react';
import { EditModal } from '@components/purchaseorders';
import { PurchaseItem } from '@type/common'; // PurchaseItem 型のインポートを確認してください

const meta: Meta<typeof EditModal> = {
  title: 'FinanSu/purchaseorders/EditModal',
  component: EditModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

// 仮の購入物品データ
const samplePurchaseItems: PurchaseItem[] = [
  {
    id: 1,
    item: 'ノートパソコン',
    price: 100000,
    quantity: 2,
    detail: 'ビジネス用',
    url: 'http://example.com',
    financeCheck: false,
    purchaseOrderID: 123,
  },
];

export const Primary: StoryFn<typeof EditModal> = (args) => <EditModal {...args} />;
Primary.args = {
  purchaseOrderId: 123,
  purchaseItems: samplePurchaseItems,
  isOpen: true,
  setIsOpen: (isOpen: boolean) => console.log('Modal is now', isOpen ? 'open' : 'closed'), // モーダルの開閉状態をコンソールで確認
};
