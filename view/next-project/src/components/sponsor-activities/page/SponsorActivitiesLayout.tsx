import Head from 'next/head';

import { Loading } from '@/components/common';
import { SponsorshipActivity } from '@/generated/model';
import { SponsorActivitiesFilterType } from '@/utils/sponsorshipActivity';
import { Card } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import { Sponsor, SponsorStyle, User, YearPeriod } from '@type/common';

import SponsorActivitiesDesktopSection from './sections/SponsorActivitiesDesktopSection';
import SponsorActivitiesHeader from './sections/SponsorActivitiesHeader';
import SponsorActivitiesMobileSection from './sections/SponsorActivitiesMobileSection';

interface SponsorActivitiesLayoutProps {
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  yearPeriods: YearPeriod[];
  selectableYearPeriods: (YearPeriod & { id: number })[];
  selectedYearPeriodId: number;
  sponsorshipActivities: SponsorshipActivity[];
  isFilterOpen: boolean;
  isLoading: boolean;
  isFiltered: boolean;
  filterData: SponsorActivitiesFilterType;
  totalAmount: number;
  onSetSelectedYearPeriodId: (value: number) => void;
  onSetFilterOpen: (isOpen: boolean) => void;
  onSetFilterData: (filterData: SponsorActivitiesFilterType) => void;
  fetchSponsorshipActivities: () => Promise<void>;
}

export default function SponsorActivitiesLayout({
  sponsorStyles,
  sponsors,
  users,
  yearPeriods,
  selectableYearPeriods,
  selectedYearPeriodId,
  sponsorshipActivities,
  isFilterOpen,
  isLoading,
  isFiltered,
  filterData,
  totalAmount,
  onSetSelectedYearPeriodId,
  onSetFilterOpen,
  onSetFilterData,
  fetchSponsorshipActivities,
}: SponsorActivitiesLayoutProps) {
  return (
    <MainLayout>
      <Head>
        <title>協賛活動一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      {isLoading && <Loading />}
      <Card w='w-full'>
        <SponsorActivitiesHeader
          sponsorStyles={sponsorStyles}
          sponsors={sponsors}
          users={users}
          yearPeriods={yearPeriods}
          selectableYearPeriods={selectableYearPeriods}
          selectedYearPeriodId={selectedYearPeriodId}
          isFilterOpen={isFilterOpen}
          isFiltered={isFiltered}
          filterData={filterData}
          sponsorshipActivities={sponsorshipActivities}
          onSetSelectedYearPeriodId={onSetSelectedYearPeriodId}
          onSetFilterOpen={onSetFilterOpen}
          onSetFilterData={onSetFilterData}
          fetchSponsorshipActivities={fetchSponsorshipActivities}
        />
        <SponsorActivitiesMobileSection
          sponsorshipActivities={sponsorshipActivities}
          users={users}
          sponsors={sponsors}
          sponsorStyles={sponsorStyles}
          yearPeriods={yearPeriods}
          totalAmount={totalAmount}
          fetchSponsorshipActivities={fetchSponsorshipActivities}
        />
        <SponsorActivitiesDesktopSection
          sponsorshipActivities={sponsorshipActivities}
          users={users}
          sponsors={sponsors}
          sponsorStyles={sponsorStyles}
          yearPeriods={yearPeriods}
          totalAmount={totalAmount}
          fetchSponsorshipActivities={fetchSponsorshipActivities}
        />
      </Card>
    </MainLayout>
  );
}
