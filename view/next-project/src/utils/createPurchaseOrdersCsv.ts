import { PurchaseOrderView, Expense } from '../type/common';
import { createCsv, createCsvData } from './createCsv';

export const createPurchaseOrdersCsv = async (
  purchaseOrdersViews: PurchaseOrderView[],
  expenses: Expense[],
) =>
  createCsv(
    createCsvData(purchaseOrdersViews, [
      {
        getCustomValue: (row) => row.purchaseOrder.id || '',
        label: 'ID',
      },
      {
        getCustomValue: (row) =>
          expenses.find((expense) => expense.id === row.purchaseOrder.expenseID)?.name || '',
        label: '申請したい局',
      },
      {
        getCustomValue: (row) => row.purchaseOrder.createdAt || '',
        label: '申請日',
      },
      {
        getCustomValue: (row) => row.purchaseOrder.deadline || '',
        label: '購入期限',
      },
      {
        getCustomValue: (row) =>
          row.purchaseItem.reduce((sum, item) => sum + item.price * item.quantity, 0) || '',
        label: '合計金額',
      },
      {
        getCustomValue: (row) => (row.purchaseOrder.financeCheck ? '○' : '' || ''),
        label: '財務局長チェック',
      },
    ]),
  );
