/**
 * Generated by orval v7.6.0 🍺
 * Do not edit manually.
 * NUTFes FinanSu API
 * FinanSu APIドキュメント
 * OpenAPI spec version: 2.0.0
 */

/**
 * 購入報告の際のパラメータ、部門と物品IDを含む
 */
export interface BuyReportWithDivisionId {
  id?: number;
  divisionId?: number;
  festivalItemID?: number;
  amount?: number;
  paidBy?: string;
}
