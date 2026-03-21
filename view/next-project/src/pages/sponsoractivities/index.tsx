import Head from 'next/head';
import { useCallback, useEffect, useMemo, useReducer, useRef, type Dispatch } from 'react';
import { MdAttachMoney, MdCircle, MdFilterList, MdInventory2 } from 'react-icons/md';

import { Loading } from '@/components/common';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';
import {
  FilterModal,
  OpenAddModalButton,
  OpenDeleteModalButton,
  OpenEditModalButton,
} from '@/components/sponsoractivities';
import { getSponsorshipActivities } from '@/generated/hooks';
import { GetSponsorshipActivitiesParams, SponsorshipActivity } from '@/generated/model';
import { createSponsorshipActivityCsv } from '@/utils/createSponsorshipActivityCsv';
import { downloadFile } from '@/utils/downloadFile';
import {
  calculateActivitiesTotalAmount,
  createDefaultSponsorActivitiesFilter,
  getActivityStatusLabel,
  getDesignProgressLabel,
  getFeasibilityStatusLabel,
  sortSponsorshipActivities,
  SponsorActivitiesFilterType,
} from '@/utils/sponsorshipActivity';
import { get } from '@api/api_methods';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import { Sponsor, SponsorStyle, User, YearPeriod } from '@type/common';

interface Props {
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  yearPeriods: YearPeriod[];
}


type SponsorActivitiesState = {
  selectedYearPeriodId: number;
  sponsorshipActivities: SponsorshipActivity[];
  isFilterOpen: boolean;
  isLoading: boolean;
  filterData: SponsorActivitiesFilterType;
};

type SponsorActivitiesAction =
  | { type: 'set-selected-year-period-id'; payload: number }
  | { type: 'set-sponsorship-activities'; payload: SponsorshipActivity[] }
  | { type: 'set-is-filter-open'; payload: boolean }
  | { type: 'set-is-loading'; payload: boolean }
  | { type: 'set-filter-data'; payload: SponsorActivitiesFilterType };

function sponsorActivitiesReducer(
  state: SponsorActivitiesState,
  action: SponsorActivitiesAction,
): SponsorActivitiesState {
  switch (action.type) {
    case 'set-selected-year-period-id':
      return { ...state, selectedYearPeriodId: action.payload };
    case 'set-sponsorship-activities':
      return { ...state, sponsorshipActivities: action.payload };
    case 'set-is-filter-open':
      return { ...state, isFilterOpen: action.payload };
    case 'set-is-loading':
      return { ...state, isLoading: action.payload };
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

const formatYYYYMMDD = (date: Date) => {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

interface SponsorStyleListProps {
  styles: SponsorshipActivity['sponsorStyles'];
}

const SponsorStyleList = ({ styles }: SponsorStyleListProps) => {
  if (!styles || styles.length === 0) {
    return <p className='text-sm text-black-600'>未定</p>;
  }

  return (
    <div className='flex flex-col gap-1'>
      {styles.map((styleLink, index) => {
        const key = `${styleLink.sponsorStyleId || index}-${styleLink.category || 'money'}-${index}`;
        const styleName = styleLink.style?.style || '';
        const styleFeature = styleLink.style?.feature || '';
        const label = [styleName, styleFeature].filter(Boolean).join(' ');

        return (
          <div key={key} className='flex items-center justify-center gap-1'>
            {styleLink.category === 'goods' ? (
              <MdInventory2 className='text-black-600' size={16} />
            ) : (
              <MdAttachMoney className='text-black-600' size={16} />
            )}
            <span className='text-sm text-black-600'>{label || '-'}</span>
          </div>
        );
      })}
    </div>
  );
};

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
  dispatch: Dispatch<SponsorActivitiesAction>;
  fetchSponsorshipActivities: () => Promise<void>;
}

interface SponsorActivitiesHeaderProps {
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  yearPeriods: YearPeriod[];
  selectableYearPeriods: (YearPeriod & { id: number })[];
  selectedYearPeriodId: number;
  isFilterOpen: boolean;
  isFiltered: boolean;
  filterData: SponsorActivitiesFilterType;
  sponsorshipActivities: SponsorshipActivity[];
  dispatch: Dispatch<SponsorActivitiesAction>;
  fetchSponsorshipActivities: () => Promise<void>;
}

const SponsorActivitiesHeader = ({
  sponsorStyles,
  sponsors,
  users,
  yearPeriods,
  selectableYearPeriods,
  selectedYearPeriodId,
  isFilterOpen,
  isFiltered,
  filterData,
  sponsorshipActivities,
  dispatch,
  fetchSponsorshipActivities,
}: SponsorActivitiesHeaderProps) => (
  <div
    className='
      mx-4 mt-8
      md:mx-8
    '
  >
    <div
      className='
        flex flex-col gap-4
        md:gap-3
      '
    >
      <div
        className='
          flex flex-col gap-4
          md:flex-row md:items-center
        '
      >
        <div
          className='
            flex flex-col items-center gap-4
            md:flex-row md:gap-11
          '
        >
          <Title title={'協賛活動一覧'} />
          <div className='flex gap-2.5'>
            <select
              className='border-b border-black-0'
              value={selectedYearPeriodId}
              onChange={(event) => {
                dispatch({ type: 'set-selected-year-period-id', payload: Number(event.target.value) });
              }}
            >
              {selectableYearPeriods.map((yearPeriod) => {
                return (
                  <option value={yearPeriod.id} key={yearPeriod.id}>
                    {yearPeriod.year}年度
                  </option>
                );
              })}
            </select>
            <div className='relative flex items-center'>
              <button
                type='button'
                aria-label='協賛フィルターを開く'
                className='
                  rounded-md p-1.5
                  hover:bg-white-100
                '
                onClick={() => {
                  dispatch({ type: 'set-is-filter-open', payload: !isFilterOpen });
                }}
              >
                <MdFilterList size='22' color='#666666' />
              </button>
              {isFiltered && (
                <div className='absolute -top-0.5 -right-0.5'>
                  <MdCircle color='rgb(4 102 140)' size={8} />
                </div>
              )}
            </div>
            {isFilterOpen && (
              <FilterModal
                setIsOpen={(next) => dispatch({ type: 'set-is-filter-open', payload: next })}
                sponsorStyles={sponsorStyles}
                sponsors={sponsors}
                users={users}
                filterData={filterData}
                setFilterData={(next) => dispatch({ type: 'set-filter-data', payload: next })}
              />
            )}
          </div>
          <PrimaryButton
            className='
              hidden w-fit whitespace-nowrap
              md:flex
            '
            onClick={async () => {
              downloadFile({
                downloadContent: await createSponsorshipActivityCsv(sponsorshipActivities),
                fileName: `協賛活動一覧_${formatYYYYMMDD(new Date())}.csv`,
                isBomAdded: true,
              });
            }}
          >
            CSVダウンロード
          </PrimaryButton>
        </div>
      </div>
      <div
        className='
          hidden
          md:flex md:justify-end
        '
      >
        <OpenAddModalButton
          users={users}
          sponsors={sponsors}
          sponsorStyles={sponsorStyles}
          yearPeriods={yearPeriods}
          onSaved={fetchSponsorshipActivities}
        >
          企業協賛登録
        </OpenAddModalButton>
      </div>
    </div>
  </div>
);

interface SponsorActivitiesMobileSectionProps {
  sponsorshipActivities: SponsorshipActivity[];
  users: User[];
  sponsors: Sponsor[];
  sponsorStyles: SponsorStyle[];
  yearPeriods: YearPeriod[];
  totalAmount: number;
  fetchSponsorshipActivities: () => Promise<void>;
}

const SponsorActivitiesMobileSection = ({
  sponsorshipActivities,
  users,
  sponsors,
  sponsorStyles,
  yearPeriods,
  totalAmount,
  fetchSponsorshipActivities,
}: SponsorActivitiesMobileSectionProps) => (
  <>
    <div
      className='
        mx-6
        md:hidden
      '
    >
      <OpenAddModalButton
        users={users}
        sponsors={sponsors}
        sponsorStyles={sponsorStyles}
        yearPeriods={yearPeriods}
        onSaved={fetchSponsorshipActivities}
      />
    </div>
    <div
      className='
        mx-6 mb-7
        md:hidden
      '
    >
      {sponsorshipActivities.map((activity) => (
        <Card key={activity.id}>
          <div className='flex flex-col gap-3 p-4'>
            <div className='text-lg font-medium text-black-300'>{activity.sponsor?.name}</div>
            <div
              className='
                grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm
                text-black-600
              '
            >
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
              <p className='mb-1 text-sm text-black-600'>協賛スタイル</p>
              <SponsorStyleList styles={activity.sponsorStyles} />
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
              <OpenDeleteModalButton id={activity.id || 0} onDeleted={fetchSponsorshipActivities} />
            </div>
          </div>
        </Card>
      ))}
      {sponsorshipActivities.length === 0 && (
        <div className='my-5 text-center text-sm text-black-600'>データがありません</div>
      )}
      <div className='mt-3 flex justify-end text-sm text-black-600'>
        合計金額：{totalAmount.toLocaleString()} 円
      </div>
    </div>
  </>
);

interface SponsorActivitiesDesktopSectionProps {
  sponsorshipActivities: SponsorshipActivity[];
  users: User[];
  sponsors: Sponsor[];
  sponsorStyles: SponsorStyle[];
  yearPeriods: YearPeriod[];
  totalAmount: number;
  fetchSponsorshipActivities: () => Promise<void>;
}

const SponsorActivitiesDesktopSection = ({
  sponsorshipActivities,
  users,
  sponsors,
  sponsorStyles,
  yearPeriods,
  totalAmount,
  fetchSponsorshipActivities,
}: SponsorActivitiesDesktopSectionProps) => (
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
                px-4 pb-2 text-sm font-normal whitespace-nowrap
                text-black-600
              '
            >
              企業名
            </th>
            <th
              className='
                px-4 pb-2 text-sm font-normal whitespace-nowrap
                text-black-600
              '
            >
              担当者
            </th>
            <th
              className='
                px-4 pb-2 text-sm font-normal whitespace-nowrap
                text-black-600
              '
            >
              ステータス
            </th>
            <th
              className='
                px-4 pb-2 text-sm font-normal whitespace-nowrap
                text-black-600
              '
            >
              協賛可否
            </th>
            <th
              className='
                px-4 pb-2 text-sm font-normal whitespace-nowrap
                text-black-600
              '
            >
              協賛スタイル
            </th>
            <th
              className='
                px-4 pb-2 text-sm font-normal whitespace-nowrap
                text-black-600
              '
            >
              デザイン
            </th>
            <th
              className='
                px-4 pb-2 text-sm whitespace-nowrap text-black-600
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

const SponsorActivitiesLayout = (props: SponsorActivitiesLayoutProps) => {
  const {
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
    dispatch,
    fetchSponsorshipActivities,
  } = props;

  return (
    <MainLayout>
      <Head>
        <title>協賛活動一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      {isLoading && <Loading />}
      <Card>
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
          dispatch={dispatch}
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
};

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
    sponsorshipActivities: [],
    isFilterOpen: false,
    isLoading: false,
    filterData: createDefaultSponsorActivitiesFilter(sponsorStyles),
  });
  const { selectedYearPeriodId, sponsorshipActivities, isFilterOpen, isLoading, filterData } = state;
  const fetchAbortControllerRef = useRef<AbortController | null>(null);

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

  const fetchSponsorshipActivities = useCallback(async () => {
    fetchAbortControllerRef.current?.abort();
    const abortController = new AbortController();
    fetchAbortControllerRef.current = abortController;

    dispatch({ type: 'set-is-loading', payload: true });

    if (allSponsorStyleIds.length > 0 && filterData.styleIds.length === 0) {
      dispatch({ type: 'set-sponsorship-activities', payload: [] });
      dispatch({ type: 'set-is-loading', payload: false });
      return;
    }

    const params: GetSponsorshipActivitiesParams = {};
    if (selectedYearPeriodId) {
      params.year_periods_id = selectedYearPeriodId;
    }
    if (filterData.feasibilityStatus !== 'all') {
      params.feasibility_status = filterData.feasibilityStatus;
    }
    if (filterData.userId !== 'all') {
      params.user_id = filterData.userId;
    }
    if (
      filterData.styleIds.length > 0 &&
      filterData.styleIds.length !== allSponsorStyleIds.length
    ) {
      params.sponsor_style_ids = filterData.styleIds;
    }

    if (filterData.selectedSort === 'default') {
      params.sort = 'updated_at';
      params.order = 'desc';
    } else if (filterData.selectedSort === 'updateSort') {
      params.sort = 'updated_at';
      params.order = 'asc';
    } else if (filterData.selectedSort === 'createDesSort') {
      params.sort = 'created_at';
      params.order = 'desc';
    } else if (filterData.selectedSort === 'createSort') {
      params.sort = 'created_at';
      params.order = 'asc';
    }

    try {
      const response = await getSponsorshipActivities(params, {
        signal: abortController.signal,
      });
      let activities = response.data.activities || [];
      const selectedStyleIdSet = new Set(filterData.styleIds);

      if (selectedStyleIdSet.size > 0 && selectedStyleIdSet.size !== allSponsorStyleIds.length) {
        activities = activities.filter((activity) =>
          (activity.sponsorStyles || []).some((styleLink) =>
            selectedStyleIdSet.has(styleLink.sponsorStyleId || 0),
          ),
        );
      }

      if (filterData.bureauId !== 'all') {
        activities = activities.filter(
          (activity) => activity.user?.bureauID === filterData.bureauId,
        );
      }
      if (filterData.sponsorId !== 'all') {
        activities = activities.filter((activity) => activity.sponsor?.id === filterData.sponsorId);
      }

      dispatch({
        type: 'set-sponsorship-activities',
        payload:
          filterData.selectedSort === 'priceSort' || filterData.selectedSort === 'priceDesSort'
            ? sortSponsorshipActivities(activities, filterData.selectedSort)
            : activities,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      dispatch({ type: 'set-sponsorship-activities', payload: [] });
    } finally {
      if (fetchAbortControllerRef.current === abortController) {
        dispatch({ type: 'set-is-loading', payload: false });
      }
    }
  }, [allSponsorStyleIds, filterData, selectedYearPeriodId]);

  useEffect(() => {
    fetchSponsorshipActivities();

    return () => {
      fetchAbortControllerRef.current?.abort();
    };
  }, [fetchSponsorshipActivities]);

  const totalAmount = useMemo(
    () => calculateActivitiesTotalAmount(sponsorshipActivities),
    [sponsorshipActivities],
  );

  return (
    <SponsorActivitiesLayout
      sponsorStyles={sponsorStyles}
      sponsors={sponsors}
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
      dispatch={dispatch}
      fetchSponsorshipActivities={fetchSponsorshipActivities}
    />
  );
}
