import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import OpenDeleteModalButton from '@/components/users/OpenDeleteModalButton';
import { authAtom } from '@/store/atoms';
import { getCurrentUser } from '@/utils/api/currentUser';
import { get } from '@api/api_methods';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout/MainLayout';
import OpenEditModalButton from '@components/users/OpenEditModalButton';
import { BUREAUS } from '@constants/bureaus';
import { ROLES } from '@constants/role';
import { User } from '@type/common';

interface Props {
  users: User[];
}

export const getServerSideProps = async () => {
  const getUserURL = process.env.SSR_API_URI + '/users';
  const userRes = await get(getUserURL);

  return {
    props: {
      users: userRes,
    },
  };
};

export default function Users(props: Props) {
  const { users } = props;
  const router = useRouter();

  const auth = useRecoilValue(authAtom);
  const [currentUser, setCurrentUser] = useState<User>();
  useEffect(() => {
    const getUser = async () => {
      const res = await getCurrentUser(auth);
      setCurrentUser(res);
    };
    getUser();
  }, []);

  const [deleteUsers, setDeleteUsers] = useState<{ users: User[]; ids: number[] }>({
    users: [],
    ids: [],
  });

  // ログイン中のユーザの権限
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
  }, [isAdmin, currentUser?.roleID]);

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
              {users.map((user: User, index) => (
                <tr key={user.id}>
                  <td
                    className={clsx(
                      'px-1 py-3',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === users.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>{user.name}</p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === users.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>
                      {BUREAUS.find((bureau) => bureau.id === user.bureauID)?.name}
                    </p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === users.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
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
                      index === users.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <div className='flex justify-end'>
                      <OpenEditModalButton id={user.id} bureaus={BUREAUS} user={user} />
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1 text-center text-sm text-black-600',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === users.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
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
