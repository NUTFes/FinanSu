import {
  ActivityStatus,
  DesignProgress,
  FeasibilityStatus,
  type SponsorshipActivity,
} from '@/generated/model';
import { SponsorStyle } from '@/type/common';

export type SponsorStyleCategory = 'money' | 'goods';

export type SponsorActivitiesSortType =
  | 'default'
  | 'updateSort'
  | 'createDesSort'
  | 'createSort'
  | 'priceDesSort'
  | 'priceSort';

export interface SponsorActivitiesFilterType {
  styleIds: number[];
  bureauId: number | 'all';
  userId: number | 'all';
  sponsorId: number | 'all';
  feasibilityStatus: FeasibilityStatus | 'all';
  selectedSort: SponsorActivitiesSortType;
}

export interface SponsorStyleSelection {
  key: string;
  category: SponsorStyleCategory;
  sponsorStyleId: number | null;
}

export const ACTIVITY_STATUS_OPTIONS: { value: ActivityStatus; label: string }[] = [
  { value: ActivityStatus.unstarted, label: '未着手' },
  { value: ActivityStatus.material_sent, label: '資料送付済み' },
  { value: ActivityStatus.forms_sent, label: 'Forms送付済み' },
  { value: ActivityStatus.confirmed, label: '協賛内容確定' },
  { value: ActivityStatus.invoice_sent, label: '請求書送付済み' },
  { value: ActivityStatus.payment_confirmed, label: '協賛金入金確認済み' },
  { value: ActivityStatus.receipt_sent, label: '領収書送付済み' },
  { value: ActivityStatus.rejected, label: '協賛不可' },
];

export const FEASIBILITY_STATUS_OPTIONS: { value: FeasibilityStatus; label: string }[] = [
  { value: FeasibilityStatus.unstarted, label: '未着手' },
  { value: FeasibilityStatus.possible, label: '可' },
  { value: FeasibilityStatus.impossible, label: '否' },
];

export const DESIGN_PROGRESS_OPTIONS: { value: DesignProgress; label: string }[] = [
  { value: DesignProgress.unstarted, label: '未着手' },
  { value: DesignProgress.created_by_student, label: '学生が作成' },
  { value: DesignProgress.created_by_company, label: '企業が作成' },
  { value: DesignProgress.completed, label: '完成' },
];

export const SORT_OPTIONS: { value: SponsorActivitiesSortType; label: string }[] = [
  { value: 'default', label: '更新日時降順' },
  { value: 'updateSort', label: '更新日時昇順' },
  { value: 'createDesSort', label: '作成日時降順' },
  { value: 'createSort', label: '作成日時昇順' },
  { value: 'priceDesSort', label: '協賛金降順' },
  { value: 'priceSort', label: '協賛金昇順' },
];

export const getActivityStatusLabel = (status?: ActivityStatus) => {
  return ACTIVITY_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? '未着手';
};

export const getFeasibilityStatusLabel = (status?: FeasibilityStatus) => {
  return FEASIBILITY_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? '未定';
};

export const getDesignProgressLabel = (progress?: DesignProgress) => {
  return DESIGN_PROGRESS_OPTIONS.find((option) => option.value === progress)?.label ?? '未着手';
};

export const getSponsorStyleCategoryLabel = (category?: SponsorStyleCategory) => {
  return category === 'goods' ? '物' : '金';
};

export const calculateActivityTotalAmount = (activity: SponsorshipActivity): number => {
  return (
    activity.sponsorStyles?.reduce((sum, styleLink) => sum + (styleLink.style?.price ?? 0), 0) ?? 0
  );
};

export const calculateActivitiesTotalAmount = (activities: SponsorshipActivity[]) => {
  return activities.reduce((sum, activity) => sum + calculateActivityTotalAmount(activity), 0);
};

export const sortSponsorshipActivities = (
  activities: SponsorshipActivity[],
  sortType: SponsorActivitiesSortType,
) => {
  const copied = [...activities];

  switch (sortType) {
    case 'updateSort':
      return copied.sort(
        (a, b) => new Date(a.updatedAt ?? 0).getTime() - new Date(b.updatedAt ?? 0).getTime(),
      );
    case 'createSort':
      return copied.sort(
        (a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime(),
      );
    case 'createDesSort':
      return copied.sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
      );
    case 'priceSort':
      return copied.sort(
        (a, b) => calculateActivityTotalAmount(a) - calculateActivityTotalAmount(b),
      );
    case 'priceDesSort':
      return copied.sort(
        (a, b) => calculateActivityTotalAmount(b) - calculateActivityTotalAmount(a),
      );
    case 'default':
    default:
      return copied.sort(
        (a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime(),
      );
  }
};

export const createDefaultSponsorActivitiesFilter = (
  sponsorStyles: SponsorStyle[],
): SponsorActivitiesFilterType => {
  return {
    styleIds: sponsorStyles
      .map((style) => style.id)
      .filter((styleId): styleId is number => styleId !== undefined),
    bureauId: 'all',
    userId: 'all',
    sponsorId: 'all',
    feasibilityStatus: 'all',
    selectedSort: 'default',
  };
};
