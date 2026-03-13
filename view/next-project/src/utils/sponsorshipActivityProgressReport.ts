import {
  ActivityStatus,
  DesignProgress,
  FeasibilityStatus,
  SponsorshipActivity,
  UpdateSponsorshipActivityRequest,
  UpdateSponsorshipActivityRequestSponsorStyleDetailsItemCategory,
} from '@/generated/model';

export type SponsorStyleOption = {
  id: number;
  style: string;
  feature: string;
  price: number;
};

export type SponsorshipActivityProgressReportFormValues = {
  designProgress: DesignProgress;
  activityStatus: ActivityStatus;
  feasibilityStatus: FeasibilityStatus;
  remarks: string;
  sponsorStyleDetails: {
    sponsorStyleId: number;
    category: UpdateSponsorshipActivityRequestSponsorStyleDetailsItemCategory;
  }[];
};

export const DESIGN_PROGRESS_LABELS: Record<DesignProgress, string> = {
  [DesignProgress.unstarted]: '未着手',
  [DesignProgress.created_by_student]: '学生作成',
  [DesignProgress.created_by_company]: '企業作成',
  [DesignProgress.completed]: 'デザイン完成',
};

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  [ActivityStatus.unstarted]: '未着手',
  [ActivityStatus.material_sent]: '資料送付済',
  [ActivityStatus.forms_sent]: '申込書送付済',
  [ActivityStatus.confirmed]: '協賛確定',
  [ActivityStatus.invoice_sent]: '請求書送付済',
  [ActivityStatus.payment_confirmed]: '入金確認済',
  [ActivityStatus.receipt_sent]: '領収書送付済',
  [ActivityStatus.rejected]: '辞退・却下',
};

export const FEASIBILITY_STATUS_LABELS: Record<FeasibilityStatus, string> = {
  [FeasibilityStatus.unstarted]: '未確認',
  [FeasibilityStatus.possible]: '協賛可',
  [FeasibilityStatus.impossible]: '協賛不可',
};

export const SPONSOR_STYLE_CATEGORY_LABELS: Record<
  UpdateSponsorshipActivityRequestSponsorStyleDetailsItemCategory,
  string
> = {
  [UpdateSponsorshipActivityRequestSponsorStyleDetailsItemCategory.money]: '金銭',
  [UpdateSponsorshipActivityRequestSponsorStyleDetailsItemCategory.goods]: '物品',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isSponsorStyleOption = (value: unknown): value is SponsorStyleOption => {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'number' &&
    typeof value.style === 'string' &&
    typeof value.feature === 'string' &&
    typeof value.price === 'number'
  );
};

export const extractSponsorStyleOptions = (value: unknown): SponsorStyleOption[] => {
  if (!Array.isArray(value)) return [];

  return value.filter(isSponsorStyleOption);
};

export const extractSponsorStyleOptionsFromActivity = (
  activity?: SponsorshipActivity,
): SponsorStyleOption[] => {
  if (!activity?.sponsorStyles) return [];

  return activity.sponsorStyles.flatMap((link) => {
    if (!link.sponsorStyleId || !link.style) {
      return [];
    }

    return [
      {
        id: link.sponsorStyleId,
        style: link.style.style,
        feature: link.style.feature,
        price: link.style.price,
      },
    ];
  });
};

export const mergeSponsorStyleOptions = (
  primary: SponsorStyleOption[],
  fallback: SponsorStyleOption[],
): SponsorStyleOption[] => {
  const merged = new Map<number, SponsorStyleOption>();

  [...primary, ...fallback].forEach((option) => {
    merged.set(option.id, option);
  });

  return Array.from(merged.values()).sort((left, right) => left.id - right.id);
};

export const getDefaultProgressReportValues = (
  activity: SponsorshipActivity,
): SponsorshipActivityProgressReportFormValues => ({
  designProgress: activity.designProgress ?? DesignProgress.unstarted,
  activityStatus: activity.activityStatus ?? ActivityStatus.unstarted,
  feasibilityStatus: activity.feasibilityStatus ?? FeasibilityStatus.unstarted,
  remarks: activity.remarks ?? '',
  sponsorStyleDetails:
    activity.sponsorStyles?.flatMap((styleLink) => {
      if (!styleLink.sponsorStyleId || !styleLink.category) {
        return [];
      }

      return [
        {
          sponsorStyleId: styleLink.sponsorStyleId,
          category: styleLink.category,
        },
      ];
    }) ?? [],
});

export const buildSponsorshipActivityProgressReportPayload = (
  activity: SponsorshipActivity,
  values: SponsorshipActivityProgressReportFormValues,
): UpdateSponsorshipActivityRequest => {
  if (!activity.yearPeriodsId || !activity.sponsorId || !activity.userId) {
    throw new Error('協賛活動の更新に必要な関連IDが不足しています');
  }

  return {
    yearPeriodsId: activity.yearPeriodsId,
    sponsorId: activity.sponsorId,
    userId: activity.userId,
    activityStatus: values.activityStatus,
    feasibilityStatus: values.feasibilityStatus,
    designProgress: values.designProgress,
    remarks: values.remarks.trim() ? values.remarks : undefined,
    sponsorStyleDetails: values.sponsorStyleDetails.map((detail) => ({
      sponsorStyleId: detail.sponsorStyleId,
      category: detail.category,
    })),
  };
};
