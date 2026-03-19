import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { MdCircle, MdFilterList } from 'react-icons/md';
import { RiExternalLinkLine } from 'react-icons/ri';

import { Loading } from '@/components/common';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';
import {
  DetailModal,
  FilterModal,
  OpenAddModalButton,
  OpenDeleteModalButton,
  OpenEditModalButton,
} from '@/components/sponsoractivities';
import AddBlankInvoiceModal from '@/components/sponsoractivities/AddBlankInvoiceModal';
import AddBlankReceiptModal from '@/components/sponsoractivities/AddBlankReceiptModal';
import { createPresentationCsv } from '@/utils/createActivityCsv';
import { downloadFile } from '@/utils/downloadFile';
import { get } from '@api/api_methods';
import { getByFiler } from '@api/sponsorActivities';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import { DESIGNERS } from '@constants/designers';
import {
  ActivityStyle,
  Sponsor,
  SponsorActivity,
  SponsorActivityView,
  SponsorFilterType,
  SponsorStyle,
  User,
  YearPeriod,
} from '@type/common';

interface Props {
  sponsorActivities: SponsorActivity[];
  sponsorActivitiesView: SponsorActivityView[];
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  activityStyles: ActivityStyle[];
  yearPeriods: YearPeriod[];
}

export async function getServerSideProps() {
  const getYearPeriodUrl = process.env.SSR_API_URI + '/years/periods';
  const periodsRes = await get(getYearPeriodUrl);
  const getSponsorStylesUrl = process.env.SSR_API_URI + '/sponsorstyles';
  const getSponsorsUrl =
    process.env.SSR_API_URI +
    '/sponsors/periods/' +
    (periodsRes
      ? String(periodsRes[periodsRes.length - 1].year)
      : String(new Date().getFullYear()));
  const getUsersUrl = process.env.SSR_API_URI + '/users';
  const getActivityStylesUrl = process.env.SSR_API_URI + '/activity_styles';

  const sponsorStylesRes = await get(getSponsorStylesUrl);
  const sponsorsRes = await get(getSponsorsUrl);
  const usersRes = await get(getUsersUrl);
  const activityStylesRes = await get(getActivityStylesUrl);

  return {
    props: {
      sponsorStyles: sponsorStylesRes,
      sponsors: sponsorsRes,
      users: usersRes,
      activityStyles: activityStylesRes,
      yearPeriods: periodsRes,
    },
  };
}

const formatYYYYMMDD = (date: Date) => {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

export default function SponsorActivities(props: Props) {
  const { sponsorStyles, sponsors, users, activityStyles, yearPeriods } = props;
  const [sponsorActivities, setSponsorActivities] = useState<SponsorActivityView[]>([]);
  const [sponsorActivitiesID, setSponsorActivitiesID] = useState<number>(1);
  const [sponsorActivitiesItem, setSponsorActivitiesViewItem] = useState<SponsorActivityView>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFilerOpen, setIsFilerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenBlankReceipt, setIsOpenBlankReceipt] = useState(false);
  const [isOpenBlankInvoice, setIsOpenBlankInvoice] = useState(false);
  const [filterData, setFilterData] = useState<SponsorFilterType>({
    styleIds: sponsorStyles.map((style) => style?.id || 0),
    isDone: 'all',
    keyword: '',
    selectedSort: 'default',
  });
  const [selectedYear, setSelectedYear] = useState<string>(
    yearPeriods
      ? String(yearPeriods[yearPeriods.length - 1].year)
      : String(new Date().getFullYear()),
  );
  const currentYear = new Date().getFullYear().toString();

  const onModalOpen = (sponsorActivitiesID: number, sponsorActivitiesItem: SponsorActivityView) => {
    setSponsorActivitiesID(sponsorActivitiesID);
    setSponsorActivitiesViewItem(sponsorActivitiesItem);
    setIsOpen(true);
  };

  const getSponsorActivities = async () => {
    setIsLoading(true);
    if (isFiltered) {
      const getSponsorActivitiesViewUrlByYear =
        process.env.CSR_API_URI + '/activities/filtered_details/' + selectedYear;
      const getFilterSponsorActivitiesByYears = await getByFiler(
        getSponsorActivitiesViewUrlByYear,
        filterData.isDone,
        filterData.styleIds,
        filterData.keyword,
        sponsorStyles.length,
      );
      setSponsorActivities(getFilterSponsorActivitiesByYears);
      setIsLoading(false);
    } else {
      const getSponsorActivitiesViewUrlByYear =
        process.env.CSR_API_URI + '/activities/details/' + selectedYear;
      const getSponsorActivitiesByYears = await get(getSponsorActivitiesViewUrlByYear);
      setSponsorActivities(getSponsorActivitiesByYears);
      setIsLoading(false);
    }

    const getSponsorActivitiesViewUrlByYear =
      process.env.CSR_API_URI + '/activities/filtered_details/' + selectedYear;
    const getFilterSponsorActivitiesByYears = await getByFiler(
      getSponsorActivitiesViewUrlByYear,
      filterData.isDone,
      filterData.styleIds,
      filterData.keyword,
      sponsorStyles.length,
    );
    setSponsorActivities(getFilterSponsorActivitiesByYears);
  };

  const sortedSponsorActivitiesViews = useMemo(() => {
    const filteredActivities = sponsorActivities;

    if (!Array.isArray(filteredActivities)) {
      return [];
    }

    switch (filterData.selectedSort) {
      case 'updateSort':
        return [...filteredActivities].sort(
          (firstObject: SponsorActivityView, secondObject: SponsorActivityView) =>
            new Date(firstObject.sponsorActivity.updatedAt || 0).getTime() >
            new Date(secondObject.sponsorActivity.updatedAt || 0).getTime()
              ? 1
              : -1,
        );
      case 'createSort':
        return [...filteredActivities].sort(
          (firstObject: SponsorActivityView, secondObject: SponsorActivityView) =>
            new Date(firstObject.sponsorActivity.createdAt || 0).getTime() <
            new Date(secondObject.sponsorActivity.createdAt || 0).getTime()
              ? -1
              : 1,
        );
      case 'createDesSort':
        return [...filteredActivities].sort(
          (firstObject: SponsorActivityView, secondObject: SponsorActivityView) =>
            new Date(firstObject.sponsorActivity.createdAt || 0).getTime() >
            new Date(secondObject.sponsorActivity.createdAt || 0).getTime()
              ? -1
              : 1,
        );
      case 'priceSort':
        return [...filteredActivities].sort(
          (firstObject: SponsorActivityView, secondObject: SponsorActivityView) =>
            firstObject.styleDetail.reduce((sum, style) => sum + style.sponsorStyle.price, 0) >
            secondObject.styleDetail.reduce((sum, style) => sum + style.sponsorStyle.price, 0)
              ? 1
              : -1,
        );
      case 'priceDesSort':
        return [...filteredActivities].sort(
          (firstObject: SponsorActivityView, secondObject: SponsorActivityView) =>
            firstObject.styleDetail.reduce((sum, style) => sum + style.sponsorStyle.price, 0) >
            secondObject.styleDetail.reduce((sum, style) => sum + style.sponsorStyle.price, 0)
              ? -1
              : 1,
        );
      default:
        return filteredActivities;
    }
  }, [filterData, sponsorActivities]);

  const TotalTransportationFee = useMemo(() => {
    let totalFee = 0;
    if (Array.isArray(sortedSponsorActivitiesViews)) {
      sortedSponsorActivitiesViews.forEach((sponsorActivityItem) => {
        totalFee += sponsorActivityItem.sponsorActivity.expense;
      });
    }
    return totalFee;
  }, [sortedSponsorActivitiesViews]);

  const TotalActivityStyleFee = useMemo(() => {
    let totalFee = 0;
    if (Array.isArray(sortedSponsorActivitiesViews)) {
      sortedSponsorActivitiesViews.forEach((sponsorActivityItem) => {
        const sponsorActivitiesStylesPrice = sponsorActivityItem.styleDetail
          ? sponsorActivityItem.styleDetail.map((styleDetail) => {
              return styleDetail.sponsorStyle.price;
            })
          : 0;
        totalFee +=
          sponsorActivitiesStylesPrice &&
          sponsorActivitiesStylesPrice.reduce((fee, price) => {
            return fee + price;
          });
      });
    }
    return totalFee;
  }, [sortedSponsorActivitiesViews]);

  const isFiltered = useMemo(() => {
    const isStyleFilter = sponsorStyles.length !== filterData.styleIds.length;
    const isDonefilter = filterData.isDone !== 'all';
    const isKeywordFilter = filterData.keyword.length !== 0;
    const isSorted = filterData.selectedSort !== 'default';
    return isStyleFilter || isDonefilter || isKeywordFilter || isSorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  useEffect(() => {
    getSponsorActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData, selectedYear]);

  return (
    <MainLayout>
      <Head>
        <title>協賛活動一覧</title>
        <meta name='viewpoinst' content='initial-scale=1.0, width=device-width' />
      </Head>
      {isLoading && <Loading />}
      <Card w='w-fit'>
        <div
          className='
            mx-4 mt-8
            md:mx-8
          '
        >
          <div
            className='
              flex flex-col gap-4
              md:flex-row md:items-center md:justify-between
            '
          >
            {/* 左側の要素 */}
            <div
              className='
                flex flex-col items-center gap-4
                md:flex-row md:gap-6
              '
            >
              <Title title={'協賛活動一覧'} />
              <select
                className='border-b border-black-0'
                defaultValue={currentYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {props.yearPeriods &&
                  props.yearPeriods.map((year) => {
                    return (
                      <option value={year.year} key={year.id}>
                        {year.year}年度
                      </option>
                    );
                  })}
              </select>
              <div className='relative flex items-center'>
                <button
                  className='
                    rounded-md p-1.5
                    hover:bg-white-100
                  '
                  onClick={() => {
                    setIsFilerOpen(!isFilerOpen);
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
              {isFilerOpen && (
                <FilterModal
                  setIsOpen={setIsFilerOpen}
                  isOpen={isFilerOpen}
                  sponsorStyles={props.sponsorStyles}
                  filterData={filterData}
                  setFilterData={setFilterData}
                />
              )}
              <PrimaryButton
                className='
                  hidden w-fit whitespace-nowrap
                  md:flex
                '
                onClick={async () => {
                  downloadFile({
                    downloadContent: await createPresentationCsv(
                      sortedSponsorActivitiesViews || [],
                    ),
                    fileName: `協賛活動一覧_${formatYYYYMMDD(new Date())}.csv`,
                    isBomAdded: true,
                  });
                }}
              >
                CSVダウンロード
              </PrimaryButton>
              <PrimaryButton
                className='
                  hidden w-fit whitespace-nowrap
                  md:flex
                '
                onClick={() => setIsOpenBlankReceipt(true)}
              >
                手入力で領収書発行
              </PrimaryButton>
              <PrimaryButton
                className='
                  hidden w-fit whitespace-nowrap
                  md:flex
                '
                onClick={() => setIsOpenBlankInvoice(true)}
              >
                手入力で請求書発行
              </PrimaryButton>
            </div>
            {/* 右側の協賛活動登録ボタン */}
            <div
              className='
                hidden
                md:block
              '
            >
              <OpenAddModalButton
                users={users}
                sponsors={sponsors}
                sponsorStyles={props.sponsorStyles}
                yearPeriods={yearPeriods}
              >
                協賛活動登録
              </OpenAddModalButton>
            </div>
          </div>
        </div>
        <div
          className='
            mx-6 my-4 flex flex-col gap-2
            md:hidden
          '
        >
          <PrimaryButton onClick={() => setIsOpenBlankReceipt(true)}>
            手入力で領収書発行
          </PrimaryButton>
          <PrimaryButton onClick={() => setIsOpenBlankInvoice(true)}>
            手入力で請求書発行
          </PrimaryButton>
        </div>
        <div
          className='
            mx-6
            md:hidden
          '
        >
          <OpenAddModalButton
            users={users}
            sponsors={props.sponsors}
            sponsorStyles={props.sponsorStyles}
            yearPeriods={yearPeriods}
          />
        </div>
        <div
          className='
            mx-6 mb-7
            md:hidden
          '
        >
          {sortedSponsorActivitiesViews &&
            sortedSponsorActivitiesViews.map((sponsorActivitiesItem) => (
              <Card key={sponsorActivitiesItem.sponsorActivity.id}>
                <div className='flex flex-col gap-3 p-4'>
                  <div className='flex items-center gap-2'>
                    {sponsorActivitiesItem.sponsorActivity.isDone ? (
                      <>
                        <div
                          className='
                          size-3 shrink-0 rounded-full bg-[#7087FF]
                        '
                        />
                        <span className='text-sm font-medium'>回収完了</span>
                      </>
                    ) : (
                      <>
                        <div
                          className='
                          size-3 shrink-0 rounded-full bg-[#FFA53C]
                        '
                        />
                        <span className='text-sm font-medium'>未回収</span>
                      </>
                    )}
                  </div>
                  <div className='text-lg font-medium text-black-300'>
                    {sponsorActivitiesItem.sponsor.name}
                  </div>
                  <div className='text-sm text-black-600'>
                    <p className='mb-1 font-medium'>協賛スタイル</p>
                    <table className='my-1 w-full table-auto border-collapse'>
                      <tbody>
                        <tr className='border-b border-primary-1'></tr>
                        {sponsorActivitiesItem.styleDetail &&
                          sponsorActivitiesItem.styleDetail.map((styleDetail) => (
                            <tr key={styleDetail.sponsorStyle.id}>
                              <td
                                className='
                                  py-1 pr-2 text-left whitespace-nowrap
                                '
                              >
                                {styleDetail.sponsorStyle.style}
                              </td>
                              <td
                                className='
                                  py-1 pr-2 text-left whitespace-nowrap
                                '
                              >
                                {styleDetail.sponsorStyle.feature}
                              </td>
                              <td className='py-1 text-right whitespace-nowrap'>
                                {styleDetail.sponsorStyle.price.toLocaleString()}円
                              </td>
                            </tr>
                          ))}
                        <tr className='border-b border-primary-1'></tr>
                      </tbody>
                    </table>
                    <div
                      className='
                      mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2
                    '
                    >
                      <span className='text-black-600'>担当者</span>
                      <span className='border-b border-primary-1'>
                        {sponsorActivitiesItem.user.name}
                      </span>
                      <span className='text-black-600'>オプション</span>
                      <span className='border-b border-primary-1'>
                        {sponsorActivitiesItem.sponsorActivity.feature || '-'}
                      </span>
                      <span className='text-black-600'>デザイン</span>
                      <div
                        className='
                        flex items-center border-b border-primary-1
                      '
                      >
                        {DESIGNERS[sponsorActivitiesItem.sponsorActivity.design] || '-'}
                        {sponsorActivitiesItem.sponsorActivity.url !== '' && (
                          <a
                            className='ml-1'
                            href={sponsorActivitiesItem.sponsorActivity.url}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <RiExternalLinkLine size={'16px'} />
                          </a>
                        )}
                      </div>
                      <span className='text-black-600'>交通費</span>
                      <span className='border-b border-primary-1'>
                        {sponsorActivitiesItem.sponsorActivity.expense.toLocaleString()}円
                      </span>
                    </div>
                  </div>
                  <div className='ml-auto flex flex-row gap-4'>
                    <OpenEditModalButton
                      id={sponsorActivitiesItem.sponsorActivity.id || '0'}
                      sponsorActivity={sponsorActivitiesItem.sponsorActivity}
                      sponsors={props.sponsors}
                      sponsorStyles={props.sponsorStyles}
                      users={users}
                      sponsorStyleDetails={sponsorActivitiesItem.styleDetail}
                      activityStyles={activityStyles}
                      year={selectedYear}
                      yearPeriods={yearPeriods}
                    />
                    <OpenDeleteModalButton id={sponsorActivitiesItem.sponsorActivity.id || 0} />
                  </div>
                </div>
              </Card>
            ))}
          {sortedSponsorActivitiesViews && sortedSponsorActivitiesViews.length === 0 && (
            <div className='my-5 text-center text-sm text-black-600'>データがありません</div>
          )}
        </div>
        <div
          className='
            mb-2 hidden overflow-auto px-8 py-5
            md:block
          '
        >
          <div className='flex justify-center'>
            <table className='mb-5 table-auto border-collapse'>
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
                    協賛スタイル
                  </th>
                  <th
                    className='
                      px-4 pb-2 text-sm font-normal whitespace-nowrap
                      text-black-600
                    '
                  >
                    担当者名
                  </th>
                  <th
                    className='
                      px-4 pb-2 text-sm font-normal whitespace-nowrap
                      text-black-600
                    '
                  >
                    回収状況
                  </th>
                  <th
                    className='
                      px-4 pb-2 text-sm font-normal whitespace-nowrap
                      text-black-600
                    '
                  >
                    オプション
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
                      px-4 pb-2 text-sm font-normal whitespace-nowrap
                      text-black-600
                    '
                  >
                    交通費
                  </th>
                  <th
                    className='
                      px-4 pb-2 text-sm whitespace-nowrap text-black-600
                    '
                  ></th>
                </tr>
              </thead>
              <tbody>
                {sortedSponsorActivitiesViews &&
                  sortedSponsorActivitiesViews.map((sponsorActivitiesItem) => (
                    <tr
                      className='
                        border-b
                        hover:bg-grey-100
                      '
                      key={sponsorActivitiesItem.sponsorActivity.id}
                    >
                      <td
                        className='
                          px-4 py-3 text-center text-sm whitespace-nowrap
                          text-black-600
                        '
                        onClick={() => {
                          onModalOpen(
                            sponsorActivitiesItem.sponsorActivity.id || 0,
                            sponsorActivitiesItem,
                          );
                        }}
                      >
                        {sponsorActivitiesItem.sponsor.name}
                      </td>
                      <td
                        className='
                          px-4 py-3 text-center text-sm whitespace-nowrap
                          text-black-600
                        '
                        onClick={() => {
                          onModalOpen(
                            sponsorActivitiesItem.sponsorActivity.id || 0,
                            sponsorActivitiesItem,
                          );
                        }}
                      >
                        {sponsorActivitiesItem.styleDetail ? (
                          sponsorActivitiesItem.styleDetail.map((styleDetail) => (
                            <div key={styleDetail.sponsorStyle.id}>
                              {`${styleDetail.sponsorStyle.style} / ${styleDetail.sponsorStyle.feature} / ${styleDetail.sponsorStyle.price} 円`}
                            </div>
                          ))
                        ) : (
                          <div className='text-red-500'>協賛スタイルを登録してください</div>
                        )}
                      </td>
                      <td
                        className='
                          px-4 py-3 text-center text-sm whitespace-nowrap
                          text-black-600
                        '
                        onClick={() => {
                          onModalOpen(
                            sponsorActivitiesItem.sponsorActivity.id || 0,
                            sponsorActivitiesItem,
                          );
                        }}
                      >
                        {sponsorActivitiesItem.user.name}
                      </td>
                      <td
                        className='
                          px-4 py-3 text-center text-sm whitespace-nowrap
                          text-black-600
                        '
                        onClick={() => {
                          onModalOpen(
                            sponsorActivitiesItem.sponsorActivity.id || 0,
                            sponsorActivitiesItem,
                          );
                        }}
                      >
                        {sponsorActivitiesItem.sponsorActivity.isDone ? '回収完了' : '未回収'}
                      </td>
                      <td
                        className='
                          px-4 py-3 text-center text-sm whitespace-nowrap
                          text-black-600
                        '
                        onClick={() => {
                          onModalOpen(
                            sponsorActivitiesItem.sponsorActivity.id || 0,
                            sponsorActivitiesItem,
                          );
                        }}
                      >
                        {sponsorActivitiesItem.sponsorActivity.feature}
                      </td>
                      <td
                        className='
                          px-4 py-3 text-center text-sm whitespace-nowrap
                          text-black-600
                        '
                        onClick={() => {
                          onModalOpen(
                            sponsorActivitiesItem.sponsorActivity.id || 0,
                            sponsorActivitiesItem,
                          );
                        }}
                      >
                        <div className='flex justify-center'>
                          {sponsorActivitiesItem.sponsorActivity.design !== 0 &&
                            DESIGNERS[sponsorActivitiesItem.sponsorActivity.design]}
                          {sponsorActivitiesItem.sponsorActivity.url !== '' && (
                            <a
                              className='mx-1'
                              href={sponsorActivitiesItem.sponsorActivity.url}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <RiExternalLinkLine size={'16px'} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td
                        className='
                          px-4 py-3 text-center text-sm whitespace-nowrap
                          text-black-600
                        '
                        onClick={() => {
                          onModalOpen(
                            sponsorActivitiesItem.sponsorActivity.id || 0,
                            sponsorActivitiesItem,
                          );
                        }}
                      >
                        {sponsorActivitiesItem.sponsorActivity.expense}
                      </td>
                      <td>
                        <div className='flex'>
                          <div className='mx-1'>
                            <OpenEditModalButton
                              id={sponsorActivitiesItem.sponsorActivity.id || '0'}
                              sponsorActivity={sponsorActivitiesItem.sponsorActivity}
                              sponsors={sponsors}
                              sponsorStyles={sponsorStyles}
                              users={users}
                              sponsorStyleDetails={sponsorActivitiesItem.styleDetail}
                              activityStyles={activityStyles}
                              year={selectedYear}
                              yearPeriods={yearPeriods}
                            />
                          </div>
                          <div className='mx-1'>
                            <OpenDeleteModalButton
                              id={sponsorActivitiesItem.sponsorActivity.id || 0}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                {sortedSponsorActivitiesViews && sortedSponsorActivitiesViews.length > 0 && (
                  <tr className='border-b border-primary-1'>
                    <td className='px-1 py-3' colSpan={1}>
                      <div className='flex justify-end'>
                        <div className='text-sm text-black-600'>合計</div>
                      </div>
                    </td>
                    <td className='px-1 py-3'>
                      <div className='text-center text-sm text-black-600'>
                        {TotalActivityStyleFee}
                      </div>
                    </td>
                    <td className='px-1 py-3' colSpan={4}>
                      <div className='flex justify-end'>
                        <div className='text-sm text-black-600'>合計</div>
                      </div>
                    </td>
                    <td className='px-1 py-3'>
                      <div className='text-center text-sm text-black-600'>
                        {TotalTransportationFee}
                      </div>
                    </td>
                  </tr>
                )}
                {(!sortedSponsorActivitiesViews || sortedSponsorActivitiesViews.length === 0) && (
                  <tr>
                    <td colSpan={9} className='py-3'>
                      <div className='text-center text-sm text-black-600'>データがありません</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {isOpenBlankReceipt && <AddBlankReceiptModal setIsOpen={setIsOpenBlankReceipt} />}
        {isOpenBlankInvoice && (
          <AddBlankInvoiceModal setIsOpen={setIsOpenBlankInvoice} sponsorStyles={sponsorStyles} />
        )}
      </Card>
      {isOpen && sponsorActivitiesItem && (
        <DetailModal
          id={sponsorActivitiesID}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          sponsorActivitiesViewItem={sponsorActivitiesItem}
          isDelete={false}
          year={selectedYear}
        />
      )}
    </MainLayout>
  );
}
