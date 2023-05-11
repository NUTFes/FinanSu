import clsx from 'clsx';
import Head from 'next/head';
import { useState, useMemo } from 'react';
import { useRecoilState } from 'recoil';

import OpenModalButton from '@/components/sponsoractivities/OpenAddModalButton';
import { userAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import { Card, Title, Card2 } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import DetailModal from '@components/sponsoractivities/DetailModal';
import OpenDeleteModalButton from '@components/sponsoractivities/OpenDeleteModalButton';
import OpenEditModalButton from '@components/sponsoractivities/OpenEditModalButton';
import { SponsorActivity, SponsorActivityView, Sponsor, SponsorStyle, User } from '@type/common';

interface Props {
  sponsorActivities: SponsorActivity[];
  sponsorActivitiesView: SponsorActivityView[];
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
}

export async function getServerSideProps() {
  const getSponsorActivitiesUrl = process.env.SSR_API_URI + '/activities';
  const getSponsorActivitiesViewUrl = process.env.SSR_API_URI + '/activities/details';
  const getSponsorStylesUrl = process.env.SSR_API_URI + '/sponsorstyles';
  const getSponsorsUrl = process.env.SSR_API_URI + '/sponsors';
  const getUsersUrl = process.env.SSR_API_URI + '/users';

  const sponsorActivitiesRes = await get(getSponsorActivitiesUrl);
  const sponsorActivitiesViewRes = await get(getSponsorActivitiesViewUrl);
  const sponsorStylesRes = await get(getSponsorStylesUrl);
  const sponsorsRes = await get(getSponsorsUrl);
  const usersRes = await get(getUsersUrl);

  return {
    props: {
      sponsorActivities: sponsorActivitiesRes,
      sponsorActivitiesView: sponsorActivitiesViewRes,
      sponsorStyles: sponsorStylesRes,
      sponsors: sponsorsRes,
      users: usersRes,
    },
  };
}

export default function SponsorActivities(props: Props) {
  const [user] = useRecoilState(userAtom);
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

  return (
    <MainLayout>
      <Head>
        <title>協賛活動一覧</title>
        <meta name='viewpoinst' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-6 mt-5 mt-10 md:mx-5'>
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
          <div className='block hidden justify-end md:flex '>
            <OpenModalButton
              users={props.users}
              sponsors={props.sponsors}
              sponsorStyles={props.sponsorStyles}
            >
              協賛活動登録
            </OpenModalButton>
          </div>
        </div>
        <div className='mb-7'>
          {filteredSponsorActivitiesViews &&
            filteredSponsorActivitiesViews.map((sponsorActivitiesItem, index) => (
              <div key={sponsorActivitiesItem.sponsorActivity.id}>
                <Card2>
                  {sponsorActivitiesItem.sponsorActivity.isDone && (
                    <div className='my-1 flex'>
                      <p className='text-[#7087FF]'>●</p>
                      <p className='mx-1'>回収完了</p>
                    </div>
                  )}
                  {!sponsorActivitiesItem.sponsorActivity.isDone && (
                    <div className='my-1 flex'>
                      <p className='text-[#FFA53C]'>●</p>
                      <p className='mx-1'>未回収</p>
                    </div>
                  )}
                  <div className=' my-1 text-lg font-medium'>
                    {sponsorActivitiesItem.sponsor.name}
                  </div>
                  <p className='mx-2 text-sm text-black-600'>協賛スタイル</p>
                  <table className='my-1 ml-3 mb-2 w-full table-fixed border-collapse text-sm'>
                    <tbody>
                      <tr className='border border-b-primary-1'></tr>
                      <tr>
                        <td className='text-center'>{sponsorActivitiesItem.sponsorStyle.style}</td>
                        <td className='text-center'>
                          {sponsorActivitiesItem.sponsorStyle.feature}
                        </td>
                        <td className='text-center'>
                          {sponsorActivitiesItem.sponsorStyle.price}円
                        </td>
                      </tr>
                      <tr className='border border-b-primary-1'></tr>
                    </tbody>
                  </table>
                  <div className='my-1 flex text-sm'>
                    <p className='mx-2 text-black-600'>担当者</p>
                    <p className='mx-7 border-b border-primary-1'>
                      {sponsorActivitiesItem.user.name}
                    </p>
                  </div>
                  <div className='my-1 flex text-sm'>
                    <p className='mx-2 text-black-600'>オプション</p>
                    <p className='border-b border-primary-1'>
                      {sponsorActivitiesItem.sponsorActivity.feature}
                    </p>
                  </div>
                  <div className='my-1 mb-2 flex text-sm'>
                    <p className='mx-2 text-black-600'>交通費</p>
                    <p className='ml-7 border-b border-primary-1'>
                      {sponsorActivitiesItem.sponsorActivity.expense}
                    </p>
                    円
                    <div className='absolute right-14 flex'>
                      <div className='mx-50 right-10'>
                        <OpenEditModalButton
                          id={sponsorActivitiesItem.sponsorActivity.id || '0'}
                          sponsorActivity={sponsorActivitiesItem.sponsorActivity}
                          sponsors={props.sponsors}
                          sponsorStyles={props.sponsorStyles}
                          users={props.users}
                        />
                      </div>
                      <div className='mx-2'>
                        <OpenDeleteModalButton id={sponsorActivitiesItem.sponsorActivity.id || 0} />
                      </div>
                    </div>
                  </div>
                </Card2>
              </div>
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
                  <tr
                    className={clsx(props.sponsorActivitiesView.length - 1 !== index && 'border-b')}
                    key={sponsorActivitiesItem.sponsorActivity.id}
                  >
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
                        <p>{sponsorActivitiesItem.sponsorStyle.style}</p>
                        <p>{sponsorActivitiesItem.sponsorStyle.feature}</p>
                        <p>{sponsorActivitiesItem.sponsorStyle.price} 円</p>
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
        <div className='fixed right-4 bottom-3 justify-end md:hidden '>
          <OpenModalButton
            users={props.users}
            sponsors={props.sponsors}
            sponsorStyles={props.sponsorStyles}
          ></OpenModalButton>
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
