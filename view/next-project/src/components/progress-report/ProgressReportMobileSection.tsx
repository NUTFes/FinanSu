'use client';

import { MdAttachMoney, MdInventory2 } from 'react-icons/md';

import { Card, EditButton, Spinner } from '@/components/common';
import { ActivityStatus, DesignProgress, type SponsorshipActivity } from '@/generated/model';
import {
  ACTIVITY_STATUS_LABELS,
  DESIGN_PROGRESS_LABELS,
} from '@/utils/sponsorshipActivityProgressReport';

const toActivityStatusLabel = (status?: ActivityStatus) => {
  if (!status) return '未定';
  return ACTIVITY_STATUS_LABELS[status] ?? '未定';
};

const toDesignProgressLabel = (designProgress?: DesignProgress) => {
  if (!designProgress) return '未定';
  return DESIGN_PROGRESS_LABELS[designProgress] ?? '未定';
};

interface ProgressReportMobileSectionProps {
  activities: SponsorshipActivity[];
  isLoading: boolean;
  hasError: boolean;
  onSelectActivity: (activityId: number) => void;
}

export default function ProgressReportMobileSection({
  activities,
  isLoading,
  hasError,
  onSelectActivity,
}: ProgressReportMobileSectionProps) {
  return (
    <div className='mb-4 md:hidden'>
      {isLoading && (
        <div className='flex items-center justify-center gap-2 py-8 text-sm text-[#666666]'>
          <Spinner size='sm' />
          読み込み中...
        </div>
      )}
      {!isLoading && hasError && (
        <p className='py-8 text-center text-sm text-[#e4434e]'>
          進捗報告一覧の取得に失敗しました。ページを更新してください。
        </p>
      )}
      {!isLoading && !hasError && activities.length === 0 && (
        <p className='py-8 text-center text-sm text-[#666666]'>データがありません</p>
      )}
      {!isLoading &&
        !hasError &&
        activities.map((item, index) => (
          <Card key={item.id ?? index}>
            <div className='flex flex-col gap-3 p-4'>
              <div className='text-lg font-medium text-[#444444]'>{item.sponsor?.name ?? '-'}</div>
              <div className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm text-[#666666]'>
                <span>代表者</span>
                <span className='min-w-0 break-words'>{item.sponsor?.representative ?? '-'}</span>
                <span>e-mail</span>
                <span className='min-w-0 break-all'>{item.sponsor?.email ?? '-'}</span>
                <span>ステータス</span>
                <span>{toActivityStatusLabel(item.activityStatus)}</span>
                <span>デザイン</span>
                <span>{toDesignProgressLabel(item.designProgress)}</span>
              </div>
              {item.sponsorStyles && item.sponsorStyles.length > 0 && (
                <div>
                  <p className='mb-1 text-sm text-[#666666]'>協賛スタイル</p>
                  <div className='space-y-1'>
                    {item.sponsorStyles.map((link, index) => {
                      const label = [link.style?.style, link.style?.feature]
                        .filter(Boolean)
                        .join(' ');
                      return (
                        <div
                          key={`${item.id}-${link.sponsorStyleId}-${index}`}
                          className='flex items-center gap-1 text-sm text-[#666666]'
                        >
                          {link.category === 'goods' ? (
                            <MdInventory2 className='shrink-0' size={16} />
                          ) : (
                            <MdAttachMoney className='shrink-0' size={16} />
                          )}
                          <span>{label || '-'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className='ml-auto'>
                <EditButton
                  onClick={() => {
                    if (item.id != null) onSelectActivity(item.id);
                  }}
                  isDisabled={item.id == null}
                />
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
}
