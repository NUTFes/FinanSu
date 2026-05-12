import { SponsorshipActivity } from '@/generated/model';
import {
  getActivityStatusLabel,
  getDesignProgressLabel,
  getFeasibilityStatusLabel,
} from '@/utils/sponsorshipActivity';
import { Sponsor, SponsorStyle, User, YearPeriod } from '@type/common';

import { OpenDeleteModalButton, OpenEditModalButton } from '../..';
import SponsorStyleList from './SponsorStyleList';

interface SponsorActivitiesDesktopSectionProps {
  sponsorshipActivities: SponsorshipActivity[];
  users: User[];
  sponsors: Sponsor[];
  sponsorStyles: SponsorStyle[];
  yearPeriods: YearPeriod[];
  totalAmount: number;
  fetchSponsorshipActivities: () => Promise<void>;
}

export default function SponsorActivitiesDesktopSection({
  sponsorshipActivities,
  users,
  sponsors,
  sponsorStyles,
  yearPeriods,
  totalAmount,
  fetchSponsorshipActivities,
}: SponsorActivitiesDesktopSectionProps) {
  return (
    <div className='mb-2 hidden overflow-x-auto px-4 py-5 md:block md:px-6'>
      <div className='min-w-245'>
        <table className='mb-2 min-w-full table-fixed border-collapse'>
          <thead>
            <tr className='border-b-primary-1 border-b py-3'>
              <th className='text-black-600 w-[22%] pr-4 pb-2 pl-8 text-center text-sm font-normal whitespace-nowrap'>
                企業名
              </th>
              <th className='text-black-600 w-[12%] px-4 pb-2 text-center text-sm font-normal whitespace-nowrap'>
                担当者
              </th>
              <th className='text-black-600 w-[12%] px-4 pb-2 text-center text-sm font-normal whitespace-nowrap'>
                ステータス
              </th>
              <th className='text-black-600 w-[12%] px-4 pb-2 text-center text-sm font-normal whitespace-nowrap'>
                協賛可否
              </th>
              <th className='text-black-600 w-[24%] px-4 pb-2 text-center text-sm font-normal whitespace-nowrap'>
                協賛スタイル
              </th>
              <th className='text-black-600 w-[10%] px-4 pb-2 text-center text-sm font-normal whitespace-nowrap'>
                デザイン
              </th>
              <th className='text-black-600 w-[8%] pr-8 pb-2 pl-4 text-center text-sm whitespace-nowrap'></th>
            </tr>
          </thead>
          <tbody>
            {sponsorshipActivities.map((activity) => (
              <tr className='hover:bg-grey-100 border-b' key={activity.id}>
                <td className='text-black-600 py-3 pr-4 pl-8 text-center text-sm'>
                  <div className='flex justify-center'>
                    <span className='block max-w-48 truncate' title={activity.sponsor?.name || '-'}>
                      {activity.sponsor?.name || '-'}
                    </span>
                  </div>
                </td>
                <td className='text-black-600 px-4 py-3 text-center text-sm'>
                  <div className='flex justify-center'>
                    <span className='block max-w-32 truncate' title={activity.user?.name || '-'}>
                      {activity.user?.name || '-'}
                    </span>
                  </div>
                </td>
                <td className='text-black-600 px-4 py-3 text-center text-sm whitespace-nowrap'>
                  {getActivityStatusLabel(activity.activityStatus)}
                </td>
                <td className='text-black-600 px-4 py-3 text-center text-sm whitespace-nowrap'>
                  {getFeasibilityStatusLabel(activity.feasibilityStatus)}
                </td>
                <td className='text-black-600 px-4 py-3 text-center text-sm'>
                  <SponsorStyleList
                    styles={activity.sponsorStyles}
                    textMaxWidthClassName='max-w-[16rem]'
                  />
                </td>
                <td className='text-black-600 px-4 py-3 text-center text-sm whitespace-nowrap'>
                  {getDesignProgressLabel(activity.designProgress)}
                </td>
                <td className='py-3 pr-8 pl-4'>
                  <div className='flex justify-center gap-2'>
                    <div>
                      <OpenEditModalButton
                        id={activity.id || 0}
                        sponsorshipActivity={activity}
                        sponsors={sponsors}
                        sponsorStyles={sponsorStyles}
                        users={users}
                        yearPeriods={yearPeriods}
                        onSaved={fetchSponsorshipActivities}
                      />
                    </div>
                    <div>
                      <OpenDeleteModalButton
                        id={activity.id || 0}
                        onDeleted={fetchSponsorshipActivities}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {sponsorshipActivities.length === 0 && (
              <tr>
                <td colSpan={7} className='py-3'>
                  <div className='text-black-600 text-center text-sm'>データがありません</div>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className='text-black-600 pt-3 pr-8 text-right text-sm'>
                合計金額：{totalAmount.toLocaleString()} 円
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
