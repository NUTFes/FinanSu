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
      <div className='min-w-[980px]'>
        <table className='mb-2 min-w-full table-fixed border-collapse'>
          <thead>
            <tr className='border-b border-b-primary-1 py-3'>
              <th
                className='
                  w-[22%] pr-4 pb-2 pl-8 text-center text-sm font-normal
                  whitespace-nowrap text-black-600
                '
              >
                企業名
              </th>
              <th
                className='
                  w-[12%] px-4 pb-2 text-center text-sm font-normal
                  whitespace-nowrap text-black-600
                '
              >
                担当者
              </th>
              <th
                className='
                  w-[12%] px-4 pb-2 text-center text-sm font-normal
                  whitespace-nowrap text-black-600
                '
              >
                ステータス
              </th>
              <th
                className='
                  w-[12%] px-4 pb-2 text-center text-sm font-normal
                  whitespace-nowrap text-black-600
                '
              >
                協賛可否
              </th>
              <th
                className='
                  w-[24%] px-4 pb-2 text-center text-sm font-normal
                  whitespace-nowrap text-black-600
                '
              >
                協賛スタイル
              </th>
              <th
                className='
                  w-[10%] px-4 pb-2 text-center text-sm font-normal
                  whitespace-nowrap text-black-600
                '
              >
                デザイン
              </th>
              <th
                className='
                  w-[8%] pr-8 pb-2 pl-4 text-center text-sm whitespace-nowrap
                  text-black-600
                '
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
                  className='py-3 pr-4 pl-8 text-center text-sm text-black-600'
                >
                  <span className='block truncate' title={activity.sponsor?.name || '-'}>
                    {activity.sponsor?.name || '-'}
                  </span>
                </td>
                <td className='px-4 py-3 text-center text-sm text-black-600'>
                  <span className='block truncate' title={activity.user?.name || '-'}>
                    {activity.user?.name || '-'}
                  </span>
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
                  <SponsorStyleList
                    styles={activity.sponsorStyles}
                    textMaxWidthClassName='max-w-[16rem]'
                  />
                </td>
                <td
                  className='
                    px-4 py-3 text-center text-sm whitespace-nowrap
                    text-black-600
                  '
                >
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
                  <div className='text-center text-sm text-black-600'>データがありません</div>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className='
                pt-3 pr-8 text-right text-sm text-black-600
              '>
                合計金額：{totalAmount.toLocaleString()} 円
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
