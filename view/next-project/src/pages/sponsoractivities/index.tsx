import clsx from 'clsx';
import Head from 'next/head';
import { useState, useMemo } from 'react';

import OpenModalButton from '@/components/sponsoractivities/OpenAddModalButton';
import { get } from '@api/api_methods';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import DetailModal from '@components/sponsoractivities/DetailModal';
import OpenDeleteModalButton from '@components/sponsoractivities/OpenDeleteModalButton';
import OpenEditModalButton from '@components/sponsoractivities/OpenEditModalButton';
import {
  SponsorActivity,
  SponsorActivityView,
  Sponsor,
  SponsorStyle,
  User,
  ActivityStyle,
} from '@type/common';

interface Props {
  sponsorActivities: SponsorActivity[];
  sponsorActivitiesView: SponsorActivityView[];
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  activityStyles: ActivityStyle[];
}

export async function getServerSideProps() {
  const getSponsorActivitiesUrl = process.env.SSR_API_URI + '/activities';
  const getSponsorActivitiesViewUrl = process.env.SSR_API_URI + '/activities/details';
  const getSponsorStylesUrl = process.env.SSR_API_URI + '/sponsorstyles';
  const getSponsorsUrl = process.env.SSR_API_URI + '/sponsors';
  const getUsersUrl = process.env.SSR_API_URI + '/users';
  const getActivityStylesUrl = process.env.SSR_API_URI + '/activity_styles';

  const sponsorActivitiesRes = await get(getSponsorActivitiesUrl);
  const sponsorActivitiesViewRes = await get(getSponsorActivitiesViewUrl);
  const sponsorStylesRes = await get(getSponsorStylesUrl);
  const sponsorsRes = await get(getSponsorsUrl);
  const usersRes = await get(getUsersUrl);
  const activityStylesRes = await get(getActivityStylesUrl);

  return {
    props: {
      sponsorActivities: sponsorActivitiesRes,
      sponsorActivitiesView: sponsorActivitiesViewRes,
      sponsorStyles: sponsorStylesRes,
      sponsors: sponsorsRes,
      users: usersRes,
      activityStyles: activityStylesRes,
    },
  };
}

export default function SponsorActivities(props: Props) {
  const [sponsorActivitiesID, setSponsorActivitiesID] = useState<number>(1);
  const [sponsorActivitiesItem, setSponsorActivitiesViewItem] = useState<SponsorActivityView>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = (sponsorActivitiesID: number, sponsorActivitiesItem: SponsorActivityView) => {
    setSponsorActivitiesID(sponsorActivitiesID);
    setSponsorActivitiesViewItem(sponsorActivitiesItem);
    setIsOpen(true);
  };

  const formatDate = (date: string) => {
    const datetime = date.replace('T', ' ').replace('Z', '');
    const datetime2 = datetime.substring(5, datetime.length - 3).replace('-', '/');
    return datetime2;
  };

  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  const filteredSponsorActivitiesViews = useMemo(() => {
    return props.sponsorActivitiesView.filter((sponsorActivitiesItem) => {
      return sponsorActivitiesItem.sponsorActivity.createdAt?.includes(selectedYear);
    });
  }, [props, selectedYear]);

  const TotalTransportationFee = useMemo(() => {
    let totalFee = 0;
    filteredSponsorActivitiesViews?.map((sponsorActivityItem) => {
      totalFee += sponsorActivityItem.sponsorActivity.expense;
    });
    return totalFee;
  }, [filteredSponsorActivitiesViews]);

  const TotalActivityStyleFee = useMemo(() => {
    let totalFee = 0;
    filteredSponsorActivitiesViews?.map((sponsorActivityItem) => {
      const sponsorActivitiesStylesPrice = sponsorActivityItem.styleDetail.map((styleDetail) => {
        return styleDetail.sponsorStyle.price;
      });
      totalFee += sponsorActivitiesStylesPrice.reduce((fee, price) => {
        return fee + price;
      });
    });
    return totalFee;
  }, [filteredSponsorActivitiesViews]);

  return (
    <MainLayout>
      <Head>
        <title>協賛活動一覧</title>
        <meta name='viewpoinst' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card w='w-full'>
        <div className='mx-6 mt-10 md:mx-5'>
          <div className='flex'>
            <Title title={'協賛活動一覧'} />
            <select
              className={'w-100'}
              defaultValue={currentYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
              <option value='2023'>2023</option>
            </select>
          </div>
          <div className='hidden justify-end md:flex '>
            <OpenModalButton
              users={props.users}
              sponsors={props.sponsors}
              sponsorStyles={props.sponsorStyles}
            >
              協賛活動登録
            </OpenModalButton>
          </div>
        </div>
        <div className='mb-7 md:hidden'>
          {filteredSponsorActivitiesViews &&
            filteredSponsorActivitiesViews.map((sponsorActivitiesItem) => (
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
                      users={props.users}
                      sponsorStyleDetails={sponsorActivitiesItem.styleDetail}
                      activityStyles={props.activityStyles}
                    />
                    <OpenDeleteModalButton id={sponsorActivitiesItem.sponsorActivity.id || 0} />
                  </div>
                </div>
              </Card>
            ))}
          {!filteredSponsorActivitiesViews.length && (
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
                <th className='w-1/11 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>交通費</div>
                </th>
                <th className='w-2/11 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>作成日時</div>
                </th>
                <th className='w-1/11 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'></div>
                </th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {filteredSponsorActivitiesViews &&
                filteredSponsorActivitiesViews.map((sponsorActivitiesItem, index) => (
                  <tr className={clsx('border-b')} key={sponsorActivitiesItem.sponsorActivity.id}>
                    <td
                      onClick={() => {
                        onOpen(
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
                        onOpen(
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
                        onOpen(
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
                        onOpen(
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
                        onOpen(
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
                        onOpen(
                          sponsorActivitiesItem.sponsorActivity.id || 0,
                          sponsorActivitiesItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {sponsorActivitiesItem.sponsorActivity.expense}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(
                          sponsorActivitiesItem.sponsorActivity.id || 0,
                          sponsorActivitiesItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {sponsorActivitiesItem.sponsorActivity.createdAt &&
                          formatDate(sponsorActivitiesItem.sponsorActivity.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className='flex'>
                        <div className='mx-1'>
                          <OpenEditModalButton
                            id={sponsorActivitiesItem.sponsorActivity.id || '0'}
                            sponsorActivity={sponsorActivitiesItem.sponsorActivity}
                            sponsors={props.sponsors}
                            sponsorStyles={props.sponsorStyles}
                            users={props.users}
                            sponsorStyleDetails={sponsorActivitiesItem.styleDetail}
                            activityStyles={props.activityStyles}
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
              {filteredSponsorActivitiesViews.length > 0 && (
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
                  <td className='px-1 py-3' colSpan={3}>
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
              {!filteredSponsorActivitiesViews.length && (
                <tr>
                  <td colSpan={6} className='py-3'>
                    <div className='text-center text-sm text-black-600'>データがありません</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className='fixed bottom-4 right-4 md:hidden '>
          <OpenModalButton
            users={props.users}
            sponsors={props.sponsors}
            sponsorStyles={props.sponsorStyles}
          />
        </div>
      </Card>
      {isOpen && sponsorActivitiesItem && (
        <DetailModal
          id={sponsorActivitiesID}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          sponsorActivitiesViewItem={sponsorActivitiesItem}
          isDelete={false}
        />
      )}
    </MainLayout>
  );
}
