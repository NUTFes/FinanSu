import { useRouter } from 'next/router';
import { useEffect, useMemo, useReducer } from 'react';

import { Loading } from '@/components/common';
import SponsorActivitiesLayout from '@/components/sponsor-activities/page/SponsorActivitiesLayout';
import { useSponsorActivitiesQuery } from '@/hooks/sponsor-activities/useSponsorActivitiesQuery';
import { useSponsorsByYear } from '@/hooks/sponsor-activities/useSponsorsByYear';
import { useClientSideData } from '@/hooks/useClientSideData';
import { useCurrentUser, useUserStore } from '@/store';
import { getList } from '@/utils/api/api_methods';
import {
  calculateActivitiesTotalAmount,
  createDefaultSponsorActivitiesFilter,
  SponsorActivitiesFilterType,
} from '@/utils/sponsorshipActivity';
import { Sponsor, SponsorStyle, User, YearPeriod } from '@type/common';

interface Props {
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  yearPeriods: YearPeriod[];
}

type SponsorActivitiesState = {
  selectedYearPeriodId: number;
  isFilterOpen: boolean;
  filterData: SponsorActivitiesFilterType;
};

type SponsorActivitiesAction =
  | { type: 'set-selected-year-period-id'; payload: number }
  | { type: 'set-is-filter-open'; payload: boolean }
  | { type: 'set-filter-data'; payload: SponsorActivitiesFilterType };

function sponsorActivitiesReducer(
  state: SponsorActivitiesState,
  action: SponsorActivitiesAction,
): SponsorActivitiesState {
  switch (action.type) {
    case 'set-selected-year-period-id':
      return { ...state, selectedYearPeriodId: action.payload };
    case 'set-is-filter-open':
      return { ...state, isFilterOpen: action.payload };
    case 'set-filter-data':
      return { ...state, filterData: action.payload };
    default:
      return state;
  }
}

// 認証が必要なエンドポイントのため、SSR ではなくクライアント側でデータを取得する。
// useReducer の初期値が取得結果に依存するので、取得完了後に本体をマウントする
export default function SponsorActivitiesPage() {
  const router = useRouter();
  const user = useCurrentUser();
  const _hasHydrated = useUserStore((state) => state._hasHydrated);

  const { data, isLoading } = useClientSideData<Props>(async () => {
    const yearPeriods = await getList<YearPeriod>(process.env.CSR_API_URI + '/years/periods');
    const targetYear =
      yearPeriods.length > 0
        ? String(yearPeriods[yearPeriods.length - 1].year)
        : String(new Date().getFullYear());

    const [sponsorStyles, sponsors, users] = await Promise.all([
      getList<SponsorStyle>(process.env.CSR_API_URI + '/sponsorstyles'),
      getList<Sponsor>(process.env.CSR_API_URI + '/sponsors/periods/' + targetYear),
      getList<User>(process.env.CSR_API_URI + '/users'),
    ]);

    return { sponsorStyles, sponsors, users, yearPeriods };
  });

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user?.roleID) {
      router.push('/');
      return;
    }
    if (![2, 3, 4].includes(user.roleID)) {
      router.push('/my_page');
    }
  }, [_hasHydrated, user?.roleID, router]);

  if (!_hasHydrated) return <Loading />;
  if (!user?.roleID || ![2, 3, 4].includes(user.roleID)) return <Loading />;
  if (isLoading || !data) return <Loading />;

  return <SponsorActivities {...data} />;
}

function SponsorActivities(props: Props) {
  const { sponsorStyles, sponsors, users, yearPeriods } = props;

  const selectableYearPeriods = useMemo(
    () =>
      yearPeriods.filter(
        (yearPeriod): yearPeriod is YearPeriod & { id: number } => yearPeriod.id !== undefined,
      ),
    [yearPeriods],
  );
  const latestYearPeriod = selectableYearPeriods[selectableYearPeriods.length - 1];
  const [state, dispatch] = useReducer(sponsorActivitiesReducer, {
    selectedYearPeriodId: latestYearPeriod?.id || 0,
    isFilterOpen: false,
    filterData: createDefaultSponsorActivitiesFilter(sponsorStyles),
  });
  const { selectedYearPeriodId, isFilterOpen, filterData } = state;
  const selectedYear = useMemo(() => {
    const selectedPeriod = selectableYearPeriods.find(
      (yearPeriod) => yearPeriod.id === selectedYearPeriodId,
    );
    return Number(selectedPeriod?.year ?? new Date().getFullYear());
  }, [selectableYearPeriods, selectedYearPeriodId]);
  const sponsorsByYear = useSponsorsByYear({
    year: selectedYear,
    initialSponsors: sponsors,
  });

  const allSponsorStyleIds = useMemo(
    () =>
      sponsorStyles
        .map((style) => style.id)
        .filter((styleId): styleId is number => styleId !== undefined),
    [sponsorStyles],
  );
  const allSponsorStyleIdSet = useMemo(() => new Set(allSponsorStyleIds), [allSponsorStyleIds]);

  const isFiltered = useMemo(() => {
    const isStyleFiltered =
      filterData.styleIds.length !== allSponsorStyleIds.length ||
      filterData.styleIds.some((styleId) => !allSponsorStyleIdSet.has(styleId));
    const isBureauFiltered = filterData.bureauId !== 'all';
    const isUserFiltered = filterData.userId !== 'all';
    const isActivityStatusFiltered = filterData.activityStatus !== 'all';
    const isDesignProgressFiltered = filterData.designProgress !== 'all';
    const isFeasibilityFiltered = filterData.feasibilityStatus !== 'all';
    const isSorted = filterData.selectedSort !== 'default';

    return (
      isStyleFiltered ||
      isBureauFiltered ||
      isUserFiltered ||
      isActivityStatusFiltered ||
      isDesignProgressFiltered ||
      isFeasibilityFiltered ||
      isSorted
    );
  }, [allSponsorStyleIdSet, allSponsorStyleIds.length, filterData]);

  const {
    activities: sponsorshipActivities,
    isLoading,
    fetchSponsorshipActivities,
  } = useSponsorActivitiesQuery({
    selectedYearPeriodId,
    filterData,
    allSponsorStyleIds,
  });

  const totalAmount = useMemo(
    () => calculateActivitiesTotalAmount(sponsorshipActivities),
    [sponsorshipActivities],
  );

  return (
    <SponsorActivitiesLayout
      sponsorStyles={sponsorStyles}
      sponsors={sponsorsByYear}
      users={users}
      yearPeriods={yearPeriods}
      selectableYearPeriods={selectableYearPeriods}
      selectedYearPeriodId={selectedYearPeriodId}
      sponsorshipActivities={sponsorshipActivities}
      isFilterOpen={isFilterOpen}
      isLoading={isLoading}
      isFiltered={isFiltered}
      filterData={filterData}
      totalAmount={totalAmount}
      onSetSelectedYearPeriodId={(value) => {
        dispatch({ type: 'set-selected-year-period-id', payload: value });
      }}
      onSetFilterOpen={(isOpen) => {
        dispatch({ type: 'set-is-filter-open', payload: isOpen });
      }}
      onSetFilterData={(nextFilterData) => {
        dispatch({ type: 'set-filter-data', payload: nextFilterData });
      }}
      fetchSponsorshipActivities={fetchSponsorshipActivities}
    />
  );
}
