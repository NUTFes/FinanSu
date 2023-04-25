import clsx from 'clsx';
import Head from 'next/head';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

import OpenModalButton from '@/components/sponsoractivities/OpenAddModalButton';
import { userAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import { Card, Title } from '@components/common';
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

  return (
    <MainLayout>
      <Head>
        <title>協賛活動一覧</title>
        <meta name='viewpoinst' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-5 mt-10'>
          <div className='flex'>
            <Title title={'協賛活動一覧'} />
            <select className={'w-100'}>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
          </div>
          <div className='flex justify-end'>
            <OpenModalButton
              users={props.users}
              sponsors={props.sponsors}
              sponsorStyles={props.sponsorStyles}
            >
              協賛活動登録
            </OpenModalButton>
          </div>
        </div>
        <div className='w-100 mb-2 p-5'>
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
                <th className='w-2/11 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>回収状況</div>
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
              {props.sponsorActivitiesView &&
                props.sponsorActivitiesView.map((sponsorActivitiesItem, index) => (
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
                        {formatDate(sponsorActivitiesItem.sponsorActivity.createdAt)}
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
              {!props.sponsorActivitiesView && (
                <tr>
                  <td colSpan={6} className='py-3'>
                    <div className='text-center text-sm text-black-600'>データがありません</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
