// Budget(予算関係)
// // Budget(予算)
export interface Budget {
  id: number;
  price: number;
  year_id: number;
  source_id: number;
  created_at?: string;
  updated_at?: string;
}

// // Source(予算の出所)
export interface Source {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// // Year(年度)
export interface Year {
  id: number;
  year: number;
  created_at?: string;
  updated_at?: string;
}

// Purchase(購入関係)
// // PurchaseItem(購入物品)
export interface PurchaseItem {
  id: number;
  item: string;
  price: number;
  quantity: number;
  detail: string;
  url: string;
  purchase_order_id: number;
  finance_check: boolean;
  created_at?: string;
  updated_at?: string;
}
// // PurchaseOrder(購入申請)
export interface PurchaseOrder {
  id: number;
  deadline: string;
  user_id: number;
  finance_check: boolean;
  created_at?: string;
  updated_at?: string;
}

// // PurchaseReport(購入報告)
export interface PurchaseReport {
  id: number;
  user_id: number;
  discount: number;
  addition: number;
  finance_check: boolean;
  remark: string;
  purchase_order_id: number;
  created_at?: string;
  updated_at?: string;
}

// Sponser(協賛関係)
// // SponserStyle(協賛スタイル)
export interface SponserStyle {
  id: number;
  scale: string;
  is_color: boolean;
  price: number;
  created_at?: string;
  updated_at?: string;
}

// // Activity(協賛活動)
export interface Activity {
  id: number;
  sponser_style_id: number;
  user_id: number;
  is_color: boolean;
  sponser_id: number;
  created_at?: string;
  updated_at?: string;
}

// // Sponser(協賛企業)
export interface Sponser {
  id: number;
  name: string;
  tel: number;
  email: string;
  address: string;
  representative: string;
  created_at?: string;
  updated_at?: string;
}

// FundInformations(募金関係)
// // FundInformation(協賛スタイル)
export interface FundInformation {
  id: number;
  user_id: number;
  teacher_id: number;
  price: number;
  remark: string;
  is_first_check: boolean;
  is_last_check: boolean;
  created_at?: string;
  updated_at?: string;
}

// // Teather(教員)
export interface Teacher {
  id: number;
  name: string;
  position: string;
  department_id: number;
  room: string;
  is_black: boolean;
  remark: string;
  created_at?: string;
  updated_at?: string;
}

// Others(その他)
// // User
export interface User {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
  created_at?: string;
  updated_at?: string;
}

// // Department(学科)
export interface Department {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// // Bureau(局)
export interface Bureau {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}
