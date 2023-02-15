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
// // PurchaseOrder(購入申請)
export interface PurchaseOrder {
  id?: number;
  deadline: string;
  userID: number;
  financeCheck: boolean;
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

// Sponser(協賛関係)
// // SponserStyle(協賛スタイル)
export interface SponserStyle {
  id?: number;
  scale: string;
  isColor: boolean;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

// // Activity(協賛活動)
export interface Activity {
  id?: number;
  sponserStyleID: number;
  userID: number;
  isColor: boolean;
  sponserID: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SponserActivitiesItem {
  id?: number;
  sponsorID: number;
  sponsorStyleID: number;
  sponserName: string;
  userID: number;
  isDone: boolean;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SponserActivity {
  id: number;
  sponsorID: number;
  sponsorStyleID: number;
  userID: number;
  isDone: boolean;
  createdAt: string;
  updated_At: string;
}

export interface SponserActivitiesView {
  viewUser: User;
  viewItem: SponserActivitiesItem;
  sponserActivitiesItems: SponserActivitiesItem[];
}

// // Sponser(協賛企業)
export interface Sponser {
  id?: number;
  name: string;
  tel: number;
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
