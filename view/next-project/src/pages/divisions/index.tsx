import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import OpenDeleteModalButton from '@/components/divisions/OpenDeleteModalButton';
import OpenAddModalButton from '@/components/divisions/OpenAddModalButton';
import { userAtom } from '@/store/atoms';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout/MainLayout';
import OpenEditModalButton from '@components/divisions/OpenEditModalButton';

interface Division {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  divisions: Division[];
}

// モックデータを使用
const mockDivisions: Division[] = [
  { id: 1, name: '技術部門', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 2, name: '営業部門', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
  { id: 3, name: '総務部門', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
];

export const getServerSideProps = async () => {
  // 本来はAPIから取得
  // const getDivisionsURL = process.env.SSR_API_URI + '/divisions';
  // const divisionRes = await get(getDivisionsURL);

  return {
    props: {
      divisions: mockDivisions,
    },
  };
};

export default function Divisions(props: Props) {
  const { divisions } = props;
  const router = useRouter();

  const user = useRecoilValue(userAtom);
  const [currentUser, setCurrentUser] = useState<any>();
  const [deleteDivisions, setDeleteDivisions] = useState<{ divisions: Division[]; ids: number[] }>({
    divisions: [],
    ids: [],
  });

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const isAdmin = useMemo(() => {
    if (currentUser?.roleID === 2 || currentUser?.roleID === 3) {
      return true;
    } else {
      return false;
    }
  }, [currentUser?.roleID]);

  useEffect(() => {
    if (!currentUser?.roleID) return;
    if (!isAdmin) {
      router.push('/purchaseorders');
    }
  }, [isAdmin, currentUser?.roleID, router]);

  return (
    <MainLayout>
      <Head>
        <title>部門管理</title>
        <meta name='description' content='ja' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Card>
        <div className='mx-5 mt-10'>
          <div className='flex justify-between items-center'>
            <Title title={'部門管理'} />
            <OpenAddModalButton />
          </div>
        </div>
        <div className='mb-2 p-5'>
          <table className='mb-5 w-full table-auto border-collapse'>
            <thead>
              <tr>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>ID</p>
                </th>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>部門名</p>
                </th>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>作成日</p>
                </th>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3' />
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <div className='flex justify-center'>
                    <OpenDeleteModalButton
                      isDisabled={deleteDivisions.ids.length == 0}
                      deleteDivisions={deleteDivisions}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {divisions.map((division: Division, index) => (
                <tr key={division.id}>
                  <td
                    className={clsx(
                      'px-1 py-3',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === divisions.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>{division.id}</p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === divisions.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>{division.name}</p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === divisions.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>
                      {division.createdAt ? new Date(division.createdAt).toLocaleDateString('ja-JP') : '-'}
                    </p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === divisions.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <div className='flex justify-end'>
                      <OpenEditModalButton id={division.id} division={division} />
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1 text-center text-sm text-black-600',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === divisions.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <input
                      checked={deleteDivisions.ids.includes(division.id)}
                      type='checkbox'
                      onChange={(e) => {
                        deleteDivisions.ids.includes(division.id)
                          ? setDeleteDivisions({
                              divisions: deleteDivisions?.divisions.filter((selectedDivision) => {
                                return selectedDivision.id !== division.id;
                              }),
                              ids: deleteDivisions?.ids.filter((selectedID) => {
                                return selectedID !== division.id;
                              }),
                            })
                          : setDeleteDivisions({
                              divisions: [...(deleteDivisions?.divisions || []), division],
                              ids: [...(deleteDivisions?.ids || []), division.id],
                            });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}