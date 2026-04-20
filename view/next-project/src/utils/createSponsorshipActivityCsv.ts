import { getBureauName } from '@/constants/bureaus';
import { SponsorshipActivity } from '@/generated/model';

import { createCsv, createCsvData } from './createCsv';
import {
  calculateActivityTotalAmount,
  getActivityStatusLabel,
  getDesignProgressLabel,
  getFeasibilityStatusLabel,
  getSponsorStyleCategoryLabel,
} from './sponsorshipActivity';

export const createSponsorshipActivityCsv = async (activities: SponsorshipActivity[]) =>
  createCsv(
    createCsvData(activities, [
      {
        label: '企業名',
        getCustomValue: (activity) => activity.sponsor?.name ?? '',
      },
      {
        label: '協賛合計金額',
        getCustomValue: (activity) => calculateActivityTotalAmount(activity),
      },
      {
        label: '協賛内容【詳細】',
        getCustomValue: (activity) =>
          activity.sponsorStyles
            ?.map((styleLink) => {
              const styleName = styleLink.style?.style ?? '';
              const styleFeature = styleLink.style?.feature ?? '';
              const stylePrice = styleLink.style?.price ?? 0;
              const category = getSponsorStyleCategoryLabel(styleLink.category);
              return `${category} ${styleName} ${styleFeature} ${stylePrice}`.trim();
            })
            .join(' / ') ?? '',
      },
      {
        label: '担当者名',
        getCustomValue: (activity) => activity.user?.name ?? '',
      },
      {
        label: '所属局',
        getCustomValue: (activity) => {
          const bureauId = activity.user?.bureauID;
          return getBureauName(bureauId ?? 0);
        },
      },
      {
        label: 'ステータス',
        getCustomValue: (activity) => getActivityStatusLabel(activity.activityStatus),
      },
      {
        label: '協賛可否',
        getCustomValue: (activity) => getFeasibilityStatusLabel(activity.feasibilityStatus),
      },
      {
        label: 'デザイン',
        getCustomValue: (activity) => getDesignProgressLabel(activity.designProgress),
      },
      {
        label: '作成日時',
        getCustomValue: (activity) => activity.createdAt ?? '',
      },
      {
        label: '更新日時',
        getCustomValue: (activity) => activity.updatedAt ?? '',
      },
      {
        label: '備考',
        getCustomValue: (activity) => activity.remarks ?? '',
      },
    ]),
  );
