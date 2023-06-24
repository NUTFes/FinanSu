import { SponsorActivityView } from '../type/common';
import { createCsv, createCsvData } from './createCsv';
import { BUREAUS } from '@/constants/bureaus';

export const createPresentationCsv = async (activityViews: SponsorActivityView[]) =>
  createCsv(
    createCsvData(activityViews, [
      {
        getCustomValue: (row) => row.sponsor.name || '',
        label: '企業名',
      },
      {
        getCustomValue: (row) =>
          row.styleDetail.reduce((sum, style) => sum + style.sponsorStyle.price, 0) || '',
        label: '協賛合計金額',
      },
      {
        getCustomValue: (row) =>
          row.styleDetail
            .map(
              (style) =>
                `${style.sponsorStyle.style} ${style.sponsorStyle.feature} ${style.sponsorStyle.price}`,
            )
            .join(' / ') || '',
        label: '協賛内容【詳細】',
      },
      {
        getCustomValue: (row) => row.user.name || '',
        label: '担当者名',
      },
      {
        getCustomValue: (row) =>
          BUREAUS.find((bureau) => bureau.id === row.user.bureauID)?.name || '',
        label: '所属局',
      },
      {
        getCustomValue: (row) => (row.sponsorActivity.isDone ? '回収済み' : '未回収' || ''),
        label: '回収状況',
      },
      {
        getCustomValue: (row) => row.sponsorActivity.feature || '',
        label: 'オプション',
      },
      {
        getCustomValue: (row) => row.sponsorActivity.expense || '',
        label: '交通費',
      },
      {
        getCustomValue: (row) => row.sponsorActivity.createdAt || '',
        label: '作成日時',
      },
      {
        getCustomValue: (row) => row.sponsorActivity.updatedAt || '',
        label: '更新日時',
      },
    ]),
  );
