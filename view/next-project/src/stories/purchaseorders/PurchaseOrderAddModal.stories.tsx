import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import PurchaseOrderAddModal from '@components/purchaseorders/PurchaseOrderAddModal';

const meta: Meta = {
  title: 'FinanSu/purchaseorders/PurchaseOrderAddModal',
  component: PurchaseOrderAddModal,
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn = (args) => <PurchaseOrderAddModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  purchaseItemNum: { value: 3 }, // 例として購入物品数を3に設定
  isOpen: true,
  numModalOnClose: () => console.log('Modal closed'),
  onClose: () => console.log('Modal closed'),
  setFormDataList: (list) => console.log('FormDataList set:', list),
  formDataList: [
    {
      id: 1,
      item: 'Example item 1',
      price: 100,
      quantity: 2,
      detail: 'Example detail',
      url: 'http://example.com',
      purchaseOrderID: 1,
      financeCheck: false,
      createdAt: '2020-01-01',
      updatedAt: '2020-01-01',
    },
    {
      id: 2,
      item: 'Example item 2',
      price: 150,
      quantity: 1,
      detail: 'Example detail',
      url: 'http://example.com',
      purchaseOrderID: 1,
      financeCheck: false,
      createdAt: '2020-01-01',
      updatedAt: '2020-01-01',
    },
  ],
  purchaseOrder: {
    id: 1,
    deadline: '2023-12-31',
    userID: 123,
    financeCheck: true,
    expenseID: 456,
  },
};
