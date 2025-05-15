import clsx from 'clsx';
import Head from 'next/head';
import { useState, useEffect, useMemo } from 'react';

import { MdFilterList, MdCircle } from 'react-icons/md';
import { RiExternalLinkLine } from 'react-icons/ri';
import { Loading } from '@/components/common';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';
import {
  OpenAddModalButton,
  DetailModal,
  OpenDeleteModalButton,
  OpenEditModalButton,
  FilterModal,
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
  SponsorActivity,
  SponsorActivityView,
  Sponsor,
  SponsorStyle,
  User,
  ActivityStyle,
  YearPeriod,
  SponsorFilterType,
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
  const [sponsorActivities, setSponsorActivities] = useState<SponsorActivityView[]>();
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
    switch (filterData.selectedSort) {
      case 'updateSort':
        if (!Array.isArray(filteredActivities)) {
          return [];
        }
        return [...filteredActivities].sort(
          (firstObject: SponsorActivityView, secondObject: SponsorActivityView) =>
            new Date(firstObject.sponsorActivity.updatedAt || 0).getTime() >
            new Date(secondObject.sponsorActivity.updatedAt || 0).getTime()
              ? 1
              : -1,
        );
      case 'createSort':
        if (!Array.isArray(filteredActivities)) {
          return [];
        }
        return [...filteredActivities].sort(
          (firstObject: SponsorActivityView, secondObject: SponsorActivityView) =>
            new Date(firstObject.sponsorActivity.createdAt || 0).getTime() <
            new Date(secondObject.sponsorActivity.createdAt || 0).getTime()
              ? -1
              : 1,
        );
      case 'createDesSort':
        if (!Array.isArray(filteredActivities)) {
          return [];
        }
        return [...filteredActivities].sort(
          (firstObject: SponsorActivityView, secondObject: SponsorActivityView) =>
            new Date(firstObject.sponsorActivity.createdAt || 0).getTime() >
            new Date(secondObject.sponsorActivity.createdAt || 0).getTime()
              ? -1
              : 1,
        );
      case 'priceSort':
        if (!Array.isArray(filteredActivities)) {
          return [];
        }
        return [...filteredActivities].sort(
          (firstObject: SponsorActivityView, secondObject: SponsorActivityView) =>
            firstObject.styleDetail.reduce((sum, style) => sum + style.sponsorStyle.price, 0) >
            secondObject.styleDetail.reduce((sum, style) => sum + style.sponsorStyle.price, 0)
              ? 1
              : -1,
        );
      case 'priceDesSort':
        if (!Array.isArray(filteredActivities)) {
          return [];
        }
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
    if (sortedSponsorActivitiesViews) {
      sortedSponsorActivitiesViews?.map((sponsorActivityItem) => {
        totalFee += sponsorActivityItem.sponsorActivity.expense;
      });
    }
    return totalFee;
  }, [sortedSponsorActivitiesViews]);

  const TotalActivityStyleFee = useMemo(() => {
    let totalFee = 0;
    if (sortedSponsorActivitiesViews) {
      sortedSponsorActivitiesViews?.map((sponsorActivityItem) => {
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
  }, [filterData]);

  useEffect(() => {
    getSponsorActivities();
  }, [filterData, selectedYear]);

  return (
    <MainLayout>
      <Head>
        <title>協賛活動一覧</title>
        <meta name='viewpoinst' content='initial-scale=1.0, width=device-width' />
      </Head>
      {isLoading && <Loading />}
      <Card w='w-full'>
        <div className='mx-6 mt-10 md:mx-5'>
          <div className='gap-4 md:flex'>
            <div className='flex'>
              <Title title={'協賛活動一覧'} />
            </div>
            <div className='my-2 flex gap-4 md:my-0'>
              <select
                className={'w-100'}
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
              <div className='flex items-center justify-center'>
                <button
                  className='rounded-md px-1 py-1 hover:bg-white-100 hover:outline-base-1'
                  onClick={() => {
                    setIsFilerOpen(!isFilerOpen);
                  }}
                >
                  <MdFilterList size='22' color='#666666' />
                </button>
                {isFiltered && (
                  <div className='absolute -mt-5 ml-6'>
                    <MdCircle color='rgb(4 102 140)' size={6} />
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
                className='hidden md:block'
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
                className='hidden md:block'
                onClick={() => setIsOpenBlankReceipt(true)}
              >
                手入力で領収書発行
              </PrimaryButton>
              <PrimaryButton
                className='hidden md:block'
                onClick={() => setIsOpenBlankInvoice(true)}
              >
                手入力で請求書発行
              </PrimaryButton>
            </div>
          </div>
        </div>
        <div className='hidden justify-end md:flex'>
          <OpenAddModalButton
            users={users}
            sponsors={sponsors}
            sponsorStyles={props.sponsorStyles}
            yearPeriods={yearPeriods}
          >
            協賛活動登録
          </OpenAddModalButton>
        </div>
        <div className='my-2 flex flex-col gap-2 md:hidden'>
          <PrimaryButton onClick={() => setIsOpenBlankReceipt(true)}>
            手入力で領収書発行
          </PrimaryButton>
          <PrimaryButton onClick={() => setIsOpenBlankInvoice(true)}>
            手入力で請求書発行
          </PrimaryButton>
        </div>
        <div className='md:hidden'>
          <OpenAddModalButton
            users={users}
            sponsors={props.sponsors}
            sponsorStyles={props.sponsorStyles}
            yearPeriods={yearPeriods}
          />
        </div>
        <div className='mb-7 md:hidden'>
          {sortedSponsorActivitiesViews &&
            sortedSponsorActivitiesViews.map((sponsorActivitiesItem) => (
              <Card key={sponsorActivitiesItem.sponsorActivity.id}>
                <div className='flex flex-col gap-2 p-4'>
                  <div>
                    {sponsorActivitiesItem.sponsorActivity.isDone && (
                      <div className='flex items-center gap-1'>
                        <div className='h-4 w-4 rounded-full bg-[#7087FF]' />
                        <p>回収完了</p>
                      </div>
                    )}
                    {!sponsorActivitiesItem.sponsorActivity.isDone && (
                      <div className='flex items-center gap-1'>
                        <div className='h-4 w-4 rounded-full bg-[#FFA53C]' />
                        <p>未回収</p>
                      </div>
                    )}
                    <div className='ml-4 text-sm text-black-600'>
                      <div className='text-lg font-medium'>
                        {sponsorActivitiesItem.sponsor.name}
                      </div>
                      <p>協賛スタイル</p>
                      <table className='my-1 w-full table-fixed border-collapse'>
                        <tbody>
                          <tr className='border border-b-primary-1'></tr>
                          {sponsorActivitiesItem.styleDetail &&
                            sponsorActivitiesItem.styleDetail.map((styleDetail) => (
                              <tr key={styleDetail.sponsorStyle.id}>
                                <td className='text-center'>{styleDetail.sponsorStyle.style}</td>
                                <td className='text-center'>{styleDetail.sponsorStyle.feature}</td>
                                <td className='text-center'>{styleDetail.sponsorStyle.price}円</td>
                              </tr>
                            ))}
                          <tr className='border border-b-primary-1'></tr>
                        </tbody>
                      </table>
                      <div className='grid grid-cols-2'>
                        <p>担当者</p>
                        <p className='w-fit border-b border-primary-1'>
                          {sponsorActivitiesItem.user.name}
                        </p>
                        <p>オプション</p>
                        <p className='w-fit border-b border-primary-1'>
                          {sponsorActivitiesItem.sponsorActivity.feature}
                        </p>
                        <p>デザイン</p>
                        <div className='flex w-fit justify-center border-b border-primary-1'>
                          {DESIGNERS[sponsorActivitiesItem.sponsorActivity.design]}
                          {sponsorActivitiesItem.sponsorActivity.url !== '' && (
                            <a
                              className={clsx('mx-1')}
                              href={sponsorActivitiesItem.sponsorActivity.url}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <RiExternalLinkLine size={'16px'} />
                            </a>
                          )}
                        </div>
                        <p>交通費</p>
                        <p className='w-fit border-b border-primary-1'>
                          {sponsorActivitiesItem.sponsorActivity.expense}円
                        </p>
                      </div>
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
        <div className='w-100 mb-2 hidden p-5 md:block'>
          <table className='mb-5 w-full table-fixed border-collapse'>
            <thead>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                <th className='w-1/11 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>企業名</div>
                </th>
                <th className='w-1/11 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>協賛スタイル</div>
                </th>
                <th className='w-1/11 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>担当者名</div>
                </th>
                <th className='w-1/11 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>回収状況</div>
                </th>
                <th className='w-1/11 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>オプション</div>
                </th>
                <th className='w-1/10 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>デザイン</div>
                </th>
                <th className='w-1/11 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>交通費</div>
                </th>
                <th className='w-1/11 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'></div>
                </th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {sortedSponsorActivitiesViews &&
                sortedSponsorActivitiesViews.map((sponsorActivitiesItem) => (
                  <tr
                    className={clsx('border-b', 'hover:bg-grey-100')}
                    key={sponsorActivitiesItem.sponsorActivity.id}
                  >
                    <td
                      onClick={() => {
                        onModalOpen(
                          sponsorActivitiesItem.sponsorActivity.id || 0,
                          sponsorActivitiesItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {sponsorActivitiesItem.sponsor.name}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onModalOpen(
                          sponsorActivitiesItem.sponsorActivity.id || 0,
                          sponsorActivitiesItem,
                        );
                      }}
                      className='py-3'
                    >
                      <div className='text-center text-sm text-black-600'>
                        {sponsorActivitiesItem.styleDetail ? (
                          sponsorActivitiesItem.styleDetail.map((styleDetail) => (
                            <div key={styleDetail.sponsorStyle.id}>
                              <p>{`${styleDetail.sponsorStyle.style} / ${styleDetail.sponsorStyle.feature} / ${styleDetail.sponsorStyle.price} 円`}</p>
                              <p></p>
                            </div>
                          ))
                        ) : (
                          <div className='text-red-500'>協賛スタイルを登録してください</div>
                        )}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onModalOpen(
                          sponsorActivitiesItem.sponsorActivity.id || 0,
                          sponsorActivitiesItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {sponsorActivitiesItem.user.name}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onModalOpen(
                          sponsorActivitiesItem.sponsorActivity.id || 0,
                          sponsorActivitiesItem,
                        );
                      }}
                    >
                      {sponsorActivitiesItem.sponsorActivity.isDone && (
                        <div className='text-center text-sm text-black-600'>回収完了</div>
                      )}
                      {!sponsorActivitiesItem.sponsorActivity.isDone && (
                        <div className='text-center text-sm text-black-600'>未回収</div>
                      )}
                    </td>
                    <td
                      onClick={() => {
                        onModalOpen(
                          sponsorActivitiesItem.sponsorActivity.id || 0,
                          sponsorActivitiesItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {sponsorActivitiesItem.sponsorActivity.feature}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onModalOpen(
                          sponsorActivitiesItem.sponsorActivity.id || 0,
                          sponsorActivitiesItem,
                        );
                      }}
                    >
                      <div className='flex justify-center text-sm text-black-600'>
                        {sponsorActivitiesItem.sponsorActivity.design !== 0 &&
                          DESIGNERS[sponsorActivitiesItem.sponsorActivity.design]}
                        {sponsorActivitiesItem.sponsorActivity.url !== '' && (
                          <a
                            className={clsx('mx-1')}
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
                      onClick={() => {
                        onModalOpen(
                          sponsorActivitiesItem.sponsorActivity.id || 0,
                          sponsorActivitiesItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {sponsorActivitiesItem.sponsorActivity.expense}
                      </div>
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
