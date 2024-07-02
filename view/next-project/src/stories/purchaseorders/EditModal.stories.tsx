import { Meta, Story } from '@storybook/react';
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
    price: '100000',
    quantity: 2,
    detail: 'ビジネス用',
    url: 'http://example.com',
    finance_check: false,
  },
];

export const Primary: Story<typeof EditModal> = (args) => <EditModal {...args} />;
Primary.args = {
  purchaseOrderId: 123,
  purchaseItems: samplePurchaseItems,
  isOpen: true,
  setIsOpen: (isOpen: boolean) => console.log('Modal is now', isOpen ? 'open' : 'closed'), // モーダルの開閉状態をコンソールで確認
};
