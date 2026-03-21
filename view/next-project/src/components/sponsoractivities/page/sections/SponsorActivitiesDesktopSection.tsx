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
    <div
      className='
        mb-2 hidden overflow-x-auto px-4 py-5
        md:block md:px-6
      '
    >
      <div className='min-w-full'>
        <table className='mb-2 min-w-full table-auto border-collapse'>
          <thead>
            <tr className='border-b border-b-primary-1 py-3'>
              <th
                className='
                  px-4 pb-2 text-sm font-normal whitespace-nowrap text-black-600
                '
              >
                企業名
              </th>
              <th
                className='
                  px-4 pb-2 text-sm font-normal whitespace-nowrap text-black-600
                '
              >
                担当者
              </th>
              <th
                className='
                  px-4 pb-2 text-sm font-normal whitespace-nowrap text-black-600
                '
              >
                ステータス
              </th>
              <th
                className='
                  px-4 pb-2 text-sm font-normal whitespace-nowrap text-black-600
                '
              >
                協賛可否
              </th>
              <th
                className='
                  px-4 pb-2 text-sm font-normal whitespace-nowrap text-black-600
                '
              >
                協賛スタイル
              </th>
              <th
                className='
                  px-4 pb-2 text-sm font-normal whitespace-nowrap text-black-600
                '
              >
                デザイン
              </th>
              <th
                className='px-4 pb-2 text-sm whitespace-nowrap text-black-600'
              ></th>
            </tr>
          </thead>
          <tbody>
            {sponsorshipActivities.map((activity) => (
              <tr
                className='
                  border-b
                  hover:bg-grey-100
                '
                key={activity.id}
              >
                <td
                  className='
                    px-4 py-3 text-center text-sm whitespace-nowrap
                    text-black-600
                  '
                >
                  {activity.sponsor?.name || '-'}
                </td>
                <td
                  className='
                    px-4 py-3 text-center text-sm whitespace-nowrap
                    text-black-600
                  '
                >
                  {activity.user?.name || '-'}
                </td>
                <td
                  className='
                    px-4 py-3 text-center text-sm whitespace-nowrap
                    text-black-600
                  '
                >
                  {getActivityStatusLabel(activity.activityStatus)}
                </td>
                <td
                  className='
                    px-4 py-3 text-center text-sm whitespace-nowrap
                    text-black-600
                  '
                >
                  {getFeasibilityStatusLabel(activity.feasibilityStatus)}
                </td>
                <td className='px-4 py-3 text-center text-sm text-black-600'>
                  <SponsorStyleList styles={activity.sponsorStyles} />
                </td>
                <td
                  className='
                    px-4 py-3 text-center text-sm whitespace-nowrap
                    text-black-600
                  '
                >
                  {getDesignProgressLabel(activity.designProgress)}
                </td>
                <td>
                  <div className='flex'>
                    <div className='mx-1'>
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
                    <div className='mx-1'>
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
                  <div className='text-center text-sm text-black-600'>データがありません</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='mt-3 flex justify-end text-sm text-black-600'>
        合計金額：{totalAmount.toLocaleString()} 円
      </div>
    </div>
  );
}
