import { SponsorshipActivity } from '@/generated/model';
import {
  getActivityStatusLabel,
  getDesignProgressLabel,
  getFeasibilityStatusLabel,
} from '@/utils/sponsorshipActivity';
import { Card } from '@components/common';
import { Sponsor, SponsorStyle, User, YearPeriod } from '@type/common';

import { OpenAddModalButton, OpenDeleteModalButton, OpenEditModalButton } from '../..';
import SponsorStyleList from './SponsorStyleList';

interface SponsorActivitiesMobileSectionProps {
  sponsorshipActivities: SponsorshipActivity[];
  users: User[];
  sponsors: Sponsor[];
  sponsorStyles: SponsorStyle[];
  yearPeriods: YearPeriod[];
  totalAmount: number;
  fetchSponsorshipActivities: () => Promise<void>;
}

export default function SponsorActivitiesMobileSection({
  sponsorshipActivities,
  users,
  sponsors,
  sponsorStyles,
  yearPeriods,
  totalAmount,
  fetchSponsorshipActivities,
}: SponsorActivitiesMobileSectionProps) {
  return (
    <>
      <div className='mx-6 md:hidden'>
        <OpenAddModalButton
          users={users}
          sponsors={sponsors}
          sponsorStyles={sponsorStyles}
          yearPeriods={yearPeriods}
          onSaved={fetchSponsorshipActivities}
        />
      </div>
      <div className='mx-6 mb-7 md:hidden'>
        {sponsorshipActivities.map((activity) => (
          <Card key={activity.id}>
            <div className='flex flex-col gap-3 p-4'>
              <div className='text-black-300 text-lg font-medium'>{activity.sponsor?.name}</div>
              <div className='text-black-600 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm'>
                <span>担当者</span>
                <span>{activity.user?.name || '-'}</span>
                <span>ステータス</span>
                <span>{getActivityStatusLabel(activity.activityStatus)}</span>
                <span>協賛可否</span>
                <span>{getFeasibilityStatusLabel(activity.feasibilityStatus)}</span>
                <span>デザイン</span>
                <span>{getDesignProgressLabel(activity.designProgress)}</span>
              </div>
              <div>
                <p className='text-black-600 mb-1 text-sm'>協賛スタイル</p>
                <SponsorStyleList
                  styles={activity.sponsorStyles}
                  textMaxWidthClassName='max-w-[14rem]'
                  alignClassName='justify-start'
                />
              </div>
              <div className='ml-auto flex flex-row gap-4'>
                <OpenEditModalButton
                  id={activity.id || 0}
                  sponsorshipActivity={activity}
                  sponsors={sponsors}
                  sponsorStyles={sponsorStyles}
                  users={users}
                  yearPeriods={yearPeriods}
                  onSaved={fetchSponsorshipActivities}
                />
                <OpenDeleteModalButton
                  id={activity.id || 0}
                  onDeleted={fetchSponsorshipActivities}
                />
              </div>
            </div>
          </Card>
        ))}
        {sponsorshipActivities.length === 0 && (
          <div className='text-black-600 my-5 text-center text-sm'>データがありません</div>
        )}
        <div className='text-black-600 mt-3 flex justify-end text-sm'>
          合計金額：{totalAmount.toLocaleString()} 円
        </div>
      </div>
    </>
  );
}
