import clsx from 'clsx';
import Head from 'next/head';
import { RiAddCircleLine } from 'react-icons/ri';

import { Card, Checkbox,  Title } from '@components/common';
import MainLayout from '@/components/layout/MainLayout';
import DetailModal from '@/components/sponsoractivities/DetailModal';
import OpenAddModalButton from '@/components/sponsoractivities/OpenAddModalButton';
import OpenDeleteModalButton from '@/components/sponsoractivities/OpenDeleteModalButton';
import OpenEditModalButton from '@/components/sponsoractivities/OpenEditModalButton'
import { SponsorActivities, SponsorActivitiesItem, User } from '@type/common'

import type { NextPage } from 'next';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/store/atoms';
import { get } from '@api/api_methods';

interface activity {
  id: number;
  sponsorID: number;
  sponsorStyleID: number;
  userID: number;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SopnserActivitiesView {
  viewUser: User;
  sponsorActivities: SponsorActivities;
  viewItem: SponsorActivitiesItem[];
}

interface Props {
  sponsorActiviries: SponsorActivities[]
  sponsorActivitiesView: SopnserActivitiesView[];
  user: User;
}

export async function getServerSideProps() {
  const getSponsorAcvitiesUrl = process.env.SSR_API_URI + '/activities';
  const getSponsorAcvitiesViewUrl = process.env.SSR_API_URI + '/activities/details';
  const sponsorActivitiesRes = await get(getSponsorAcvitiesUrl);
  const sponsorActivitiesViewRes = await get(getSponsorAcvitiesViewUrl);
  return {
    props: {
      sponsorActivities: sponsorActivitiesRes,
      sponsorActivitiesView: sponsorActivitiesViewRes,
    },
  };
}

export default function SponsorActivity(props: Props) {
  const [user] = useRecoilState(userAtom);
  const [sponsorActivitiesID, setSponsorActivitiesID] = useState<number>(1);
  const [sponsorActivitiesViewItem, setSponsorActivitiesViewItem] = useState<SopnserActivitiesView>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = (sponsorActivitiesID: number, sponsorActivitiesItem: SopnserActivitiesView) => {
    setSponsorActivitiesID(sponsorActivitiesID);
    setSponsorActivitiesViewItem(sponsorActivitiesItem);
    setIsOpen(true);
  };

  const formatDate = (date: string) => {
    const datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(5, datetime.length - 10).replace('-', '/');
    return datetime2;
  };

  return (
    <MainLayout>
      <Head>
        <title>協賛金一覧</title>
        <meta name='viewpoinst' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className={clsx('mx-5 mt-10')}>
          <div className={clsx('flex')}>
            <Title title={'協賛企業一覧'} />
              <select className={'w-100'}>
                <option value='2021'>2021</option>
                <option value='2022'>2022</option>
              </select>
            </div>
            <div className={clsx('flex justify-end')}>
            <OpenAddModalButton>協賛活動登録</OpenAddModalButton>
          </div>
        </div>
          <div className={clsx('w-100 mb-2 p-5')}>
            <table className={clsx('mb-5 w-full table-fixed border-collapse')}>
              <thead>
                <tr className={clsx('border border-x-white-0 border-b-primary-1 border-t-white-0 py-3')}>
                  <th className={clsx('w-1/11 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>ID</div>
                  </th>
                  <th className={clsx('w-1/11 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>協賛ID</div>
                  </th>
                  <th className={clsx('w-1/11 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      協賛スタイルID
                    </div>
                  </th>
                  <th className={clsx('w-1/11 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>ユーザーID</div>
                  </th>
                  <th className={clsx('w-2/11 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>回収状況</div>
                  </th>
                  <th className={clsx('w-2/11 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>作成日時</div>
                  </th>
                  <th className={clsx('w-2/11 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>更新日時</div>
                  </th>
                  <th className={clsx('w-1/11 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}></div>
                  </th>
                </tr>
              </thead>
            <tbody className={clsx('border border-x-white-0 border-b-primary-1 border-t-white-0')}>
                {props.sponsorActivitiesView.length? props.sponsorActivitiesView.map((sponsorActivitiesViewItem, index) => (
                  <tr key={sponsorActivitiesViewItem.sponsorActivities.id}>
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === props.sponsorActivitiesView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                      )}
                      onClick={() => {
                        onOpen(
                          sponsorActivitiesViewItem.sponsorActivities.id
                            ? sponsorActivitiesViewItem.sponsorActivities.id
                            : 0,
                          sponsorActivitiesViewItem,
                        );
                      }}
                    >
                      <div className={clsx('text-center text-sm text-black-600')}>{sponsorActivitiesViewItem.sponsorActivities.id}</div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.sponsorActivitiesView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('text-center text-sm text-black-600')}>{sponsorActivitiesViewItem.sponsorActivities.sponsorID}</div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.sponsorActivitiesView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('text-center text-sm text-black-600')}>
                        {sponsorActivitiesViewItem.sponsorActivities.sponsorStyleID}
                      </div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.sponsorActivitiesView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('text-center text-sm text-black-600')}>{sponsorActivitiesViewItem.sponsorActivities.userID}</div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.sponsorActivitiesView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      {sponsorActivitiesViewItem.sponsorActivities.isDone && (
                        <div className={clsx('text-center text-sm text-black-600')}>回収完了</div>
                      )}
                      {!sponsorActivitiesViewItem.sponsorActivities.isDone && (
                        <div className={clsx('text-center text-sm text-black-600')}>未回収</div>
                      )}
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.sponsorActivitiesView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('text-center text-sm text-black-600')}>{sponsorActivitiesViewItem.sponsorActivities.createdAt}</div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.sponsorActivitiesView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('text-center text-sm text-black-600')}>{sponsorActivitiesViewItem.sponsorActivities.updatedAt}</div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.sponsorActivitiesView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('flex')}>
                        <div className={clsx('mx-1')}>
                          <OpenEditModalButton
                            id={
                              sponsorActivitiesViewItem.sponsorActivities.id
                                ? sponsorActivitiesViewItem.sponsorActivities.id
                                : 0
                            }
                            isDisabled={
                              (user.bureauID === 2 ||
                                user.bureauID === 3 ||
                                user.bureauID === 6 ||
                                user.id === sponsorActivitiesViewItem.sponsorActivities.id)
                            }
                          />
                        </div>
                        <div className={clsx('mx-1')}>
                          <OpenDeleteModalButton
                            id={
                              sponsorActivitiesViewItem.sponsorActivities.id
                                ? sponsorActivitiesViewItem.sponsorActivities.id
                                : 0
                            } isDisabled={
                              (user.bureauID === 2 ||
                                user.bureauID === 3 ||
                                user.bureauID === 6 ||
                                user.id === sponsorActivitiesViewItem.sponsorActivities.id)
                            }
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )): ""}
              </tbody>
            </table>
          </div>
      </Card>
      {isOpen && sponsorActivitiesViewItem && (
        <DetailModal
          id={sponsorActivitiesID}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          sponsorActivitiesViewItem={sponsorActivitiesViewItem}
          isDelete={false}
        />
      )}
    </MainLayout>
  );
}
