export type PaidByFilterInput = {
  paidByUserId?: number | null;
  paidBy?: string | null | undefined;
};

export type PaidByFilterParams = {
  paid_by_user_id?: number;
  paid_by?: string;
};

export const normalizePaidBy = (value: string | null | undefined): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizePaidByUserId = (value: number | null | undefined): number | null => {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) return null;
  return value;
};

export const buildPaidByFilterParams = (input: PaidByFilterInput): PaidByFilterParams => {
  const paidByUserId = normalizePaidByUserId(input.paidByUserId);
  if (paidByUserId != null) {
    return { paid_by_user_id: paidByUserId };
  }

  const paidBy = normalizePaidBy(input.paidBy);
  if (paidBy != null) {
    return { paid_by: paidBy };
  }

  return {};
};
