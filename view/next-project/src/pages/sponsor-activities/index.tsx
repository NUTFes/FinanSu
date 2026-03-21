import { useEffect, useMemo, useReducer } from 'react';

import SponsorActivitiesLayout from '@/components/sponsor-activities/page/SponsorActivitiesLayout';
import { useSponsorActivitiesQuery } from '@/hooks/sponsor-activities/useSponsorActivitiesQuery';
import { useSponsorsByYear } from '@/hooks/sponsor-activities/useSponsorsByYear';
import { get } from '@/utils/api/api_methods';
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

export async function getServerSideProps() {
  const getYearPeriodUrl = process.env.SSR_API_URI + '/years/periods';
  const periodsRes = await get(getYearPeriodUrl);
  const yearPeriods = Array.isArray(periodsRes) ? periodsRes : [];
  const getSponsorStylesUrl = process.env.SSR_API_URI + '/sponsorstyles';
  const getSponsorsUrl =
    process.env.SSR_API_URI +
    '/sponsors/periods/' +
    (yearPeriods.length > 0
      ? String(yearPeriods[yearPeriods.length - 1].year)
      : String(new Date().getFullYear()));
  const getUsersUrl = process.env.SSR_API_URI + '/users';

  const [sponsorStylesRes, sponsorsRes, usersRes] = await Promise.all([
    get(getSponsorStylesUrl),
    get(getSponsorsUrl),
    get(getUsersUrl),
  ]);

  return {
    props: {
      sponsorStyles: Array.isArray(sponsorStylesRes) ? sponsorStylesRes : [],
      sponsors: Array.isArray(sponsorsRes) ? sponsorsRes : [],
      users: Array.isArray(usersRes) ? usersRes : [],
      yearPeriods,
    },
  };
}

export default function SponsorActivities(props: Props) {
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
  const sponsorIdSetByYear = useMemo(
    () =>
      new Set(
        sponsorsByYear
          .map((sponsor) => sponsor.id)
          .filter((sponsorId): sponsorId is number => sponsorId !== undefined),
      ),
    [sponsorsByYear],
  );

  const isFiltered = useMemo(() => {
    const isStyleFiltered =
      filterData.styleIds.length !== allSponsorStyleIds.length ||
      filterData.styleIds.some((styleId) => !allSponsorStyleIdSet.has(styleId));
    const isBureauFiltered = filterData.bureauId !== 'all';
    const isUserFiltered = filterData.userId !== 'all';
    const isSponsorFiltered = filterData.sponsorId !== 'all';
    const isFeasibilityFiltered = filterData.feasibilityStatus !== 'all';
    const isSorted = filterData.selectedSort !== 'default';

    return (
      isStyleFiltered ||
      isBureauFiltered ||
      isUserFiltered ||
      isSponsorFiltered ||
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

  useEffect(() => {
    if (filterData.sponsorId === 'all') return;
    if (sponsorIdSetByYear.has(filterData.sponsorId)) return;

    dispatch({
      type: 'set-filter-data',
      payload: { ...filterData, sponsorId: 'all' },
    });
  }, [filterData, sponsorIdSetByYear]);

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
