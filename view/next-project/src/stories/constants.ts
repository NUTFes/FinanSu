import {
  PurchaseReport,
  PurchaseReportView,
  User,
  PurchaseOrder,
  PurchaseItem,
  Expense,
} from '../type/common';

export const USER = {
  id: 0,
  name: 'test name',
  bureauID: 0,
  roleID: 0,
  isDeleted: false,
} as User;

export const EXPENSES = [
  {
    id: 0,
    name: '総務局',
    totalPrice: 10000,
    yearID: 123,
  },
] as Expense[];

export const PURCHASE_REPORT = {
  id: 0,
  userID: 0,
  expenseID: 0,
  discount: 100,
  addition: 100,
  financeCheck: false,
  remark: 'test remark',
  buyer: 'test buyer',
  purchaseOrderID: 0,
  createdAt: ' 2021-09-01T00:00:00.000Z',
  updatedAt: ' 2021-09-01T00:00:00.000Z',
} as PurchaseReport;

export const PURCHASE_ORDER = {
  id: 0,
  deadline: '2021-09-01T00:00:00.000Z',
  userID: 0,
  financeCheck: false,
  expenseID: 0,
  createdAt: '2021-09-01T00:00:00.000Z',
  updatedAt: '2021-09-01T00:00:00.000Z',
} as PurchaseOrder;

export const PURCHASE_ITEM = {
  id: 0,
  item: 'test item',
  price: 100,
  quantity: 1,
  detail: 'test detail',
  url: 'test url',
  financeCheck: false,
  createdAt: '2021-09-01T00:00:00.000Z',
  updatedAt: '2021-09-01T00:00:00.000Z',
} as PurchaseItem;

export const PURCHASE_REPORT_VIEW = {
  purchaseReport: PURCHASE_REPORT,
  purchaseOrder: PURCHASE_ORDER,
  orderUser: USER,
  reportUser: USER,
  purchaseItems: [PURCHASE_ITEM],
} as PurchaseReportView;
