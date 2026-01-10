import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import OpenDeleteModalButton from '@/components/users/OpenDeleteModalButton';
import { userAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout/MainLayout';
import OpenEditModalButton from '@components/users/OpenEditModalButton';
import { ROLES } from '@constants/role';
import { Bureau, User } from '@type/common';

interface Props {
  users: User[];
  bureaus: Bureau[];
}

export const getServerSideProps = async () => {
  const getUserURL = process.env.SSR_API_URI + '/users';
  const getBureausURL = process.env.SSR_API_URI + '/bureaus';
  const userRes = await get(getUserURL);
  const bureauRes = await get(getBureausURL);

  return {
    props: {
      users: userRes,
      bureaus: bureauRes,
    },
  };
};

export default function Users(props: Props) {
  const { users, bureaus } = props;
  const router = useRouter();

  const user = useRecoilValue(userAtom);
  const [currentUser, setCurrentUser] = useState<User>();
  const [selectedBureau, setSelectedBureau] = useState(0);
  const [filterUsers, setFilterUsers] = useState<User[]>(users);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    const newFilterUsers =
      selectedBureau === 0 ? users : users.filter((user) => user.bureauID === selectedBureau);
    setFilterUsers(newFilterUsers);
  }, [selectedBureau, users]);

  const [deleteUsers, setDeleteUsers] = useState<{ users: User[]; ids: number[] }>({
    users: [],
    ids: [],
  });

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
        <title>ユーザ一覧</title>
        <meta name='description' content='ja' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Card>
        <div className='mx-5 mt-10'>
          <div className='flex'>
            <Title title={'ユーザー一覧'} />
            <select
              className='md:w-100 mx-auto my-4 w-fit md:mx-10 md:my-0'
              value={selectedBureau}
              onChange={(e) => setSelectedBureau(Number(e.target.value))}
            >
              <option value={0}>全ての学科</option>
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
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>氏名</p>
                </th>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>学科</p>
                </th>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>権限</p>
                </th>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3' />
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <div className='flex justify-center'>
                    <OpenDeleteModalButton
                      isDisabled={deleteUsers.ids.length == 0}
                      deleteUsers={deleteUsers}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {filterUsers.map((user: User, index) => (
                <tr key={user.id}>
                  <td
                    className={clsx(
                      'px-1 py-3',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === filterUsers.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>{user.name}</p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === filterUsers.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>
                      {bureaus.find((bureau) => bureau.id === user.bureauID)?.name}
                    </p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === filterUsers.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>
                      {ROLES.find((role) => role.id === user.roleID)?.name}
                    </p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === filterUsers.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <div className='flex justify-end'>
                      <OpenEditModalButton id={user.id} bureaus={bureaus} user={user} />
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1 text-center text-sm text-black-600',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === filterUsers.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <input
                      checked={deleteUsers.ids.includes(user.id)}
                      type='checkbox'
                      onChange={(e) => {
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
