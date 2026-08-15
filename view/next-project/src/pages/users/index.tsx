import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import OpenDeleteModalButton from '@/components/users/OpenDeleteModalButton';
import { useClientSideData } from '@/hooks/useClientSideData';
import { useCurrentUser, useUserStore } from '@/store';
import { getList } from '@api/api_methods';
import { Card, Loading, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout/MainLayout';
import OpenEditModalButton from '@components/users/OpenEditModalButton';
import { ROLES } from '@constants/role';
import { Bureau, User } from '@type/common';

export default function Users() {
  const router = useRouter();

  const user = useCurrentUser();
  const _hasHydrated = useUserStore((state) => state._hasHydrated);
  const [selectedBureau, setSelectedBureau] = useState(0);

  const { data, isLoading } = useClientSideData(async () => {
    const [userRes, bureauRes] = await Promise.all([
      getList<User>(process.env.CSR_API_URI + '/users'),
      getList<Bureau>(process.env.CSR_API_URI + '/bureaus'),
    ]);
    return { users: userRes, bureaus: bureauRes };
  });
  const users = useMemo(() => data?.users ?? [], [data]);
  const bureaus = useMemo(() => data?.bureaus ?? [], [data]);
  const [filterUsers, setFilterUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user?.roleID) {
      router.push('/');
      return;
    }
    if (user.roleID !== 2 && user.roleID !== 3) {
      router.push('/my_page');
    }
  }, [_hasHydrated, user?.roleID, router]);

  useEffect(() => {
    const newFilterUsers =
      selectedBureau === 0 ? users : users.filter((user) => user.bureauID === selectedBureau);
    setFilterUsers(newFilterUsers);
  }, [selectedBureau, users]);

  const [deleteUsers, setDeleteUsers] = useState<{ users: User[]; ids: number[] }>({
    users: [],
    ids: [],
  });

  if (!_hasHydrated) return <Loading />;
  if (!user?.roleID || (user.roleID !== 2 && user.roleID !== 3)) return <Loading />;
  if (isLoading) return <Loading />;

  return (
    <MainLayout>
      <Head>
        <title>ユーザ一覧</title>
        <meta name='description' content='ja' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Card>
        <div className='mx-5 mt-10'>
          <div className='flex'>
            <Title title={'ユーザー一覧'} />
            <select
              className='mx-auto my-4 w-fit md:mx-10 md:my-0 md:w-100'
              value={selectedBureau}
              onChange={(e) => setSelectedBureau(Number(e.target.value))}
            >
              <option value={0}>全ての局</option>
              {bureaus.map((bureau) => (
                <option value={bureau.id} key={bureau.id}>
                  {bureau.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='mb-2 p-5'>
          <table className='mb-5 w-full table-auto border-collapse'>
            <thead>
              <tr>
                <th className='border-b-primary-1 border-b py-3'>
                  <p className='text-black-600 text-center text-sm'>氏名</p>
                </th>
                <th className='border-b-primary-1 border-b py-3'>
                  <p className='text-black-600 text-center text-sm'>局</p>
                </th>
                <th className='border-b-primary-1 border-b py-3'>
                  <p className='text-black-600 text-center text-sm'>権限</p>
                </th>
                <th className='border-b-primary-1 border-b py-3' />
                <th className='border-b-primary-1 border-b py-3'>
                  <div className='flex justify-center'>
                    <OpenDeleteModalButton
                      isDisabled={deleteUsers.ids.length == 0}
                      deleteUsers={deleteUsers}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filterUsers.map((user: User, index) => (
                <tr key={user.id}>
                  <td
                    className={clsx(
                      'px-1 py-3',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === filterUsers.length - 1 ? 'pt-3 pb-4' : `border-b py-3`,
                    )}
                  >
                    <p className='text-black-600 text-center text-sm'>{user.name}</p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === filterUsers.length - 1 ? 'pt-3 pb-4' : `border-b py-3`,
                    )}
                  >
                    <p className='text-black-600 text-center text-sm'>
                      {bureaus.find((bureau) => bureau.id === user.bureauID)?.name}
                    </p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === filterUsers.length - 1 ? 'pt-3 pb-4' : `border-b py-3`,
                    )}
                  >
                    <p className='text-black-600 text-center text-sm'>
                      {ROLES.find((role) => role.id === user.roleID)?.name}
                    </p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === filterUsers.length - 1 ? 'pt-3 pb-4' : `border-b py-3`,
                    )}
                  >
                    <div className='flex justify-end'>
                      <OpenEditModalButton id={user.id} bureaus={bureaus} user={user} />
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'text-black-600 px-1 text-center text-sm',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === filterUsers.length - 1 ? 'pt-3 pb-4' : `border-b py-3`,
                    )}
                  >
                    <input
                      checked={deleteUsers.ids.includes(user.id)}
                      type='checkbox'
                      onChange={(_e) => {
                        deleteUsers.ids.includes(user.id)
                          ? setDeleteUsers({
                              users: deleteUsers?.users.filter((selectedUser) => {
                                return selectedUser.id !== user.id;
                              }),
                              ids: deleteUsers?.ids.filter((selectedID) => {
                                return selectedID !== user.id;
                              }),
                            })
                          : setDeleteUsers({
                              users: [...(deleteUsers?.users || []), user],
                              ids: [...(deleteUsers?.ids || []), user.id],
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
