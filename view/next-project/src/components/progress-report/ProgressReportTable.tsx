import { EditButton, Spinner } from '@/components/common';
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

const formatSponsorStyleLabel = (activity: SponsorshipActivity) => {
  if (!activity.sponsorStyles || activity.sponsorStyles.length === 0) return '未定';

  return (
    <div className='space-y-1'>
      {activity.sponsorStyles.map((sponsorStyleLink, index) => (
        <div key={`${activity.id}-${sponsorStyleLink.sponsorStyleId}-${index}`}>
          {`${
            sponsorStyleLink.category === 'money'
              ? '金'
              : sponsorStyleLink.category === 'goods'
                ? '物'
                : ''
          } ${sponsorStyleLink.style?.style ?? ''}${
            sponsorStyleLink.style?.feature ? ` ${sponsorStyleLink.style.feature}` : ''
          }`.trim()}
        </div>
      ))}
    </div>
  );
};

interface ProgressReportTableProps {
  activities: SponsorshipActivity[];
  isLoading: boolean;
  hasError: boolean;
  onSelectActivity: (activityId: number) => void;
}

export default function ProgressReportTable({
  activities,
  isLoading,
  hasError,
  onSelectActivity,
}: ProgressReportTableProps) {
  return (
    <div className='overflow-auto'>
      <table className='w-full table-auto border-collapse'>
        <thead>
          <tr className='border-b border-[rgb(86,218,255)]/60'>
            <th className='px-4 pb-2 text-center text-sm font-normal whitespace-nowrap text-[#666666]'>
              企業名
            </th>
            <th className='px-4 pb-2 text-center text-sm font-normal whitespace-nowrap text-[#666666]'>
              代表者
            </th>
            <th className='px-4 pb-2 text-center text-sm font-normal whitespace-nowrap text-[#666666]'>
              e-mail
            </th>
            <th className='px-4 pb-2 text-center text-sm font-normal whitespace-nowrap text-[#666666]'>
              ステータス
            </th>
            <th className='px-4 pb-2 text-center text-sm font-normal whitespace-nowrap text-[#666666]'>
              協賛スタイル
            </th>
            <th className='px-4 pb-2 text-center text-sm font-normal whitespace-nowrap text-[#666666]'>
              デザイン
            </th>
            <th className='px-4 py-3 text-center text-sm font-normal text-[#666666]'></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr className='border-b border-[#e5e7eb]'>
              <td colSpan={7} className='px-4 py-8'>
                <div className='flex items-center justify-center gap-2 text-sm text-[#666666]'>
                  <Spinner size='sm' />
                  読み込み中...
                </div>
              </td>
            </tr>
          )}
          {!isLoading && hasError && (
            <tr className='border-b border-[#e5e7eb]'>
              <td colSpan={7} className='px-4 py-8 text-center text-sm text-[#e4434e]'>
                進捗報告一覧の取得に失敗しました。ページを更新してください。
              </td>
            </tr>
          )}
          {!isLoading && !hasError && activities.length === 0 && (
            <tr className='border-b border-[#e5e7eb]'>
              <td colSpan={7} className='px-4 py-8 text-center text-sm text-[#666666]'>
                データがありません
              </td>
            </tr>
          )}
          {!isLoading &&
            !hasError &&
            activities.length > 0 &&
            activities.map((item) => (
              <tr key={item.id} className='border-b border-[#e5e7eb]/80 hover:bg-[#f9fafb]'>
                <td className='px-4 py-3 text-center text-sm whitespace-nowrap text-[#666666]'>
                  {item.sponsor?.name ?? '-'}
                </td>
                <td className='px-4 py-3 text-center text-sm whitespace-nowrap text-[#666666]'>
                  {item.sponsor?.representative ?? '-'}
                </td>
                <td className='px-4 py-3 text-center text-sm whitespace-nowrap text-[#666666]'>
                  {item.sponsor?.email ?? '-'}
                </td>
                <td className='px-4 py-3 text-center text-sm whitespace-nowrap text-[#666666]'>
                  {toActivityStatusLabel(item.activityStatus)}
                </td>
                <td className='px-4 py-3 text-center text-sm text-[#666666]'>
                  {formatSponsorStyleLabel(item)}
                </td>
                <td className='px-4 py-3 text-center text-sm whitespace-nowrap text-[#666666]'>
                  {toDesignProgressLabel(item.designProgress)}
                </td>
                <td className='px-4 py-3 text-center'>
                  <div className='flex justify-center'>
                    <EditButton
                      onClick={() => {
                        if (item.id) onSelectActivity(item.id);
                      }}
                      isDisabled={!item.id}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
