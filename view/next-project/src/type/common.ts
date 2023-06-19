// Budget(予算関係)
// // Budget(予算)
export interface Budget {
  id?: number;
  price: number;
  yearID: number;
  sourceID: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetView {
  budget: Budget;
  year: Year;
  source: Source;
}

// // Source(予算の出所)
export interface Source {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// // Year(年度)
export interface Year {
  id?: number;
  year: number;
  createdAt?: string;
  updatedAt?: string;
}

// Purchase(購入関係)
// // PurchaseItem(購入物品)
export interface PurchaseItem {
  id?: number;
  item: string;
  price: number;
  quantity: number;
  detail: string;
  url: string;
  purchaseOrderID: number;
  financeCheck: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Expense(支出)
export interface Expense {
  id?: number;
  name: string;
  totalPrice: number;
  yearID: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseView {
  expense: Expense;
  purchaseDetails: [
    {
      purchaseOrder: PurchaseOrder;
      purchaseReport: PurchaseReport;
      purchaseItems: PurchaseItem[];
    },
  ];
}

// // PurchaseOrder(購入申請)
export interface PurchaseOrder {
  id?: number;
  deadline: string;
  userID: number;
  financeCheck: boolean;
  expenseID: number;
  createdAt?: string;
  updatedAt?: string;
}

// // PurchaseReport(購入報告)
export interface PurchaseReport {
  id?: number;
  userID: number;
  discount: number;
  addition: number;
  financeCheck: boolean;
  remark: string;
  purchaseOrderID: number;
  createdAt?: string;
  updatedAt?: string;
}

// Sponsor(協賛関係)
// // SponsorStyle(協賛スタイル)
export interface SponsorStyle {
  id?: number;
  style: string;
  feature: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityStyle {
  id?: number;
  activityID: number;
  sponsorStyleID: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SponsorStyleDetail {
  activityStyle: ActivityStyle;
  sponsorStyle: SponsorStyle;
}

// // Activity(協賛活動)
export interface SponsorActivity {
  id?: number;
  sponsorID: number;
  userID: number;
  isDone: boolean;
  feature: string;
  expense: number;
  remark: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SponsorActivityView {
  user: User;
  sponsor: Sponsor;
  sponsorActivity: SponsorActivity;
  styleDetail: SponsorStyleDetail[];
}

// // Sponsor(協賛企業)
export interface Sponsor {
  id?: number;
  name: string;
  tel: string;
  email: string;
  address: string;
  representative: string;
  createdAt?: string;
  updatedAt?: string;
}

// FundInformations(募金関係)
// // FundInformation(協賛スタイル)
export interface FundInformation {
  id?: number;
  userID: number;
  teacherID: number;
  price: number;
  remark: string;
  isFirstCheck: boolean;
  isLastCheck: boolean;
  receivedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

// // Teather(教員)
export interface Teacher {
  id?: number;
  name: string;
  position: string;
  departmentID: number;
  room: string;
  isBlack: boolean;
  remark: string;
  createdAt?: string;
  updatedAt?: string;
}

// Others(その他)
// // User
export interface User {
  id: number;
  name: string;
  bureauID: number;
  roleID: number;
  createdAt?: string;
  updatedAt?: string;
}

// // SignUp
export interface SignUp {
  email: string;
  password: string;
  passwordConfirmation: string;
}

// // SignIn
export interface SignIn {
  email: string;
  password: string;
}

// // Department(学科)
export interface Department {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// // Bureau(局)
export interface Bureau {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// for view Types
export interface PurchaseOrderView {
  purchaseOrder: PurchaseOrder;
  user: User;
  purchaseItem: PurchaseItem[];
}

export interface PurchaseReportView {
  purchaseReport: PurchaseReport;
  purchaseOrder: PurchaseOrder;
  orderUser: User;
  reportUser: User;
  purchaseItems: PurchaseItem[];
}
