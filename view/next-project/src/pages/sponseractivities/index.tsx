import clsx from 'clsx';
import Head from 'next/head';
import { RiAddCircleLine } from 'react-icons/ri';

import { Title, Card } from '@components/common';
import MainLayout from '@/components/layout/MainLayout';
import DetailModal from '@components/sponsersactivities/DetailModal';
import OpenAddModalButton from '@components/sponsersactivities/OpenAddModalButton';
import OpenDeleteModalButton from '@components/sponsersactivities/OpenDeleteModalButton';
import OpenEditModalButton from '@components/sponsersactivities/OpenEditModalButton'
import { SponserActivitiesItem, User } from '@type/common'

import type { NextPage } from 'next';
import { useState } from 'react';
import { useResetRecoilState } from 'recoil';
import { userAtom } from '@/store/atoms';

interface activity {
  id: number;
  sponsorID: number;
  sponsorStyleID: number;
  userID: number;
  isDone: boolean;
  createdAt: string;
  updated_At: string;
}

export interface SopnserActivitiesView {
  viewUser: User;
  sponserActivitiesItems: SponserActivitiesItem;
}

interface Props {
  user: User;
  sponserActivitiesView: SopnserActivitiesView[];
}

const activity = (props: Props) => {
  const [user] = useResetRecoilState(userAtom);

  const [sponserActivitiesID, setSponserActivitiesID] = useState<number>(1);
  const [sponserActivitiesItem, setSponserActivitiesItem] = useState<SopnserActivitiesView>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = (sponserActivitiesID: number, sponserActivitiesItem: SopnserActivitiesView) => {
    setSponserActivitiesID(sponserActivitiesID);
    setSponserActivitiesItem(sponserActivitiesItem);
    setIsOpen(true);
  };

  const initSponserList:SponserActivitiesItem[] = [];
  props.sponserActivitiesView.map((value) => {
    initSponserList.push(value.sponserActivitiesItems)
  })
  const sponserList: SponserActivitiesItem[] = initSponserList;

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
            <OpenAddModalButton>協賛スタイル登録</OpenAddModalButton>
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
                {props.sponserActivitiesView.map((sponserActivitiesItem, index) => (
                  <tr key={sponserActivitiesItem.sponserActivitiesItems.id}>
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === sponserList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                      )}
                      onClick={() => {
                        onOpen(
                          sponserActivitiesItem.sponserActivitiesItems.id
                            ? sponserActivitiesItem.sponserActivitiesItems.id
                            : 0,
                          sponserActivitiesItem,
                        );
                      }}
                    >
                      <div className={clsx('text-center text-sm text-black-600')}>{sponserActivitiesItem.sponserActivitiesItems.id}</div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponserList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('text-center text-sm text-black-600')}>{sponserActivitiesItem.sponserActivitiesItems.sponsorID}</div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponserList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('text-center text-sm text-black-600')}>
                        {sponserActivitiesItem.sponserActivitiesItems.sponsorStyleID}
                      </div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponserList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('text-center text-sm text-black-600')}>{sponserActivitiesItem.sponserActivitiesItems.userID}</div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponserList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      {sponserActivitiesItem.sponserActivitiesItems.isDone && (
                        <div className={clsx('text-center text-sm text-black-600')}>回収完了</div>
                      )}
                      {!sponserActivitiesItem.sponserActivitiesItems.isDone && (
                        <div className={clsx('text-center text-sm text-black-600')}>未回収</div>
                      )}
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponserList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('text-center text-sm text-black-600')}>{sponserActivitiesItem.sponserActivitiesItems.createdAt}</div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponserList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('text-center text-sm text-black-600')}>{sponserActivitiesItem.sponserActivitiesItems.updatedAt}</div>
                    </td>
                    <td
                      className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponserList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}>
                      <div className={clsx('flex')}>
                        <div className={clsx('mx-1')}>
                          <OpenEditModalButton
                            id={
                              sponserActivitiesItem.sponserActivitiesItems.id
                                ? sponserActivitiesItem.sponserActivitiesItems.id
                                : 0
                            }
                            isDisabled={
                              (user.bureauID === 2 ||
                                user.bureauID === 3 ||
                                user.bureauID === 6 ||
                                user.id === sponserActivitiesItem.viewUser.id)
                            }
                          />
                        </div>
                        <div className={clsx('mx-1')}>
                          <OpenDeleteModalButton
                            id={
                              sponserActivitiesItem.sponserActivitiesItems.id
                                ? sponserActivitiesItem.sponserActivitiesItems.id
                                : 0
                            } isDisabled={
                              (user.bureauID === 2 ||
                                user.bureauID === 3 ||
                                user.bureauID === 6 ||
                                user.id === sponserActivitiesItem.viewUser.id)
                            }
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </Card>
      {isOpen && sponserActivitiesItem && (
        <DetailModal
          id={sponserActivitiesID}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          sponserActivitiesViewItem={sponserActivitiesItem}
          isDelete={false}
        />
      )}
    </MainLayout>
  );
};

export default activity;
