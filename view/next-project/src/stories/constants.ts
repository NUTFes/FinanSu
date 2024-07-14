import {
  PurchaseReport,
  PurchaseReportView,
  User,
  PurchaseOrder,
  PurchaseItem,
  Expense,
  Sponsor,
  SponsorActivity,
  SponsorActivityInformation,
  SponsorStyleDetail,
  ActivityStyle,
  SponsorStyle,
  SponsorActivityView,
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

export const SPONSOR = {
  // // Sponsor(協賛企業)
  id: 1,
  name: 'test-name',
  tel: '080-1234-5678',
  email: 'test@gmail.com',
  address: '東京都千代田区',
  representative: 'test-representative',
  createdAt: '2021-09-01T00:00:00.000Z',
  updatedAt: '2021-09-01T00:00:00.000Z',
} as Sponsor;

export const SPONSOR_ACTIVITY = {
  id: 1,
  sponsorID: 1,
  userID: 1,
  isDone: true,
  feature: 'test-feature',
  expense: 1000,
  remark: 'test-remark',
  design: 1,
  url: 'https://test.com',
  createdAt: '2021-09-01T00:00:00.000Z',
  updatedAt: '2021-09-01T00:00:00.000Z',
} as SponsorActivity;

export const SPONSOR_ACTIVITY_INFORMATION = {
  id: 1,
  activityID: 1,
  bucketName: 'test-bucket-name',
  fileName: 'test-file-name',
  fileType: 'test-file-type',
  designProgress: 1,
  fileInformation: 'test-file-information',
  createdAt: '2021-09-01T00:00:00.000Z',
  updatedAt: '2021-09-01T00:00:00.000Z',
} as SponsorActivityInformation;

export const ACTIVITY_STYLE = {
  id: 1,
  activityID: 1,
  sponsorStyleID: 1,
  createdAt: '2021-09-01T00:00:00.000Z',
  updatedAt: '2021-09-01T00:00:00.000Z',
} as ActivityStyle;

export const SPONSOR_STYLE = {
  id: 1,
  style: 'test-style',
  feature: 'test-feature',
  price: 10000,
  createdAt: '2021-09-01T00:00:00.000Z',
  updatedAt: '2021-09-01T00:00:00.000Z',
} as SponsorStyle;

export const SPONSOR_STYLE_DETAIL = {
  activityStyle: ACTIVITY_STYLE,
  sponsorStyle: SPONSOR_STYLE,
} as SponsorStyleDetail;

export const SPONSOR_ACTIVITY_VIEW = {
  user: USER,
  sponsor: SPONSOR,
  sponsorActivity: SPONSOR_ACTIVITY,
  sponsorActivityInformations: [SPONSOR_ACTIVITY_INFORMATION],
  styleDetail: [SPONSOR_STYLE_DETAIL],
} as SponsorActivityView;
