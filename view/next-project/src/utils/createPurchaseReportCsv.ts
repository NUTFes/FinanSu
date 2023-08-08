import { PurchaseReportView, Expense } from '../type/common';
import { createCsv, createCsvData } from './createCsv';

export const createPurchaseReportCsv = async (
  purchaseReportsViews: PurchaseReportView[],
  expenses: Expense[],
) =>
  createCsv(
    createCsvData(purchaseReportsViews, [
      {
        getCustomValue: (row) => row.purchaseReport.id || '',
        label: 'ID',
      },
      {
        getCustomValue: (row) =>
          expenses.find((expense) => expense.id === row.purchaseOrder.expenseID)?.name || '',
        label: '報告した局',
      },
      {
        getCustomValue: (row) => String(row.purchaseReport.createdAt).split('T')[0] || '',
        label: '報告日',
      },
      {
        getCustomValue: (row) => row.purchaseOrder.deadline || '',
        label: '購入日',
      },
      {
        getCustomValue: (row) =>
          row.purchaseItems.reduce(
            (sum, item) => (item.financeCheck ? sum + item.price * item.quantity : sum),
            0,
          ) +
            row.purchaseReport.addition -
            row.purchaseReport.discount || '0',
        label: '合計金額',
      },
      {
        getCustomValue: (row) => (row.purchaseReport.financeCheck ? '○' : '' || ''),
        label: '財務局長チェック',
      },
      {
        getCustomValue: (row) =>
          row.purchaseItems
            .map(
              (item) =>
                `${item.item}/${item.price}円/${item.quantity}個/` +
                (item.financeCheck ? '○' : '×'),
            )
            .join(' , ') || '',
        label: '購入物品 (品名/値段/数量/財務局長チェック)',
      },
      {
        getCustomValue: (row) => row.purchaseReport.remark || '',
        label: '備考',
      },
    ]),
  );
