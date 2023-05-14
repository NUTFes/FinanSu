import clsx from 'clsx';
import Head from 'next/head';
import { useMemo, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { DEPARTMENTS } from '@/constants/departments';
import { authAtom } from '@/store/atoms';
import { getCurrentUser } from '@/utils/api/currentUser';
import { get } from '@api/api_methods';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import OpenAddModalButton from '@components/teacher/OpenAddModalButton';
import OpenDeleteModalButton from '@components/teacher/OpenDeleteModalButton';
import OpenEditModalButton from '@components/teacher/OpenEditModalButton';
import { Teacher, User } from '@type/common';

interface Props {
  teachers: Teacher[];
}

export const getServerSideProps = async () => {
  const getTeacherURL = process.env.SSR_API_URI + '/teachers';
  const teacherRes = await get(getTeacherURL);
  return {
    props: {
      teachers: teacherRes,
    },
  };
};
export default function TeachersList(props: Props) {
  const { teachers } = props;

  const auth = useRecoilValue(authAtom);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isDisabled = useMemo(() => {
    if (currentUser?.roleID === 2 || currentUser?.roleID === 3 || currentUser?.id === 4) {
      return false;
    } else {
      return true;
    }
  }, [currentUser?.roleID, currentUser?.id, currentUser]);

  useEffect(() => {
    const getUser = async () => {
      const res = await getCurrentUser(auth);
      setCurrentUser(res);
    };
    getUser();
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>教員一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-5 mt-10'>
          <div className='flex'>
            <Title title={'教員一覧'} />
          </div>
          <div className='hidden justify-end md:flex'>
            <OpenAddModalButton>教員登録</OpenAddModalButton>
          </div>
        </div>
        <div className='mb-2 overflow-scroll p-5'>
          <table className='mb-5 w-max table-auto border-collapse md:w-full'>
            <thead className='text-sm text-black-600'>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                <th>
                  <p>氏名</p>
                </th>
                <th>
                  <p>職位</p>
                </th>
                <th>
                  <p>学科</p>
                </th>
                <th>
                  <p>居室</p>
                </th>
                <th>
                  <p>備考</p>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {teachers.map((teacher, index) => (
                <tr
                  key={teacher.name}
                  className={clsx(
                    index !== teachers.length - 1 && 'border-b',
                    'text-sm text-black-600',
                  )}
                >
                  <td className='py-3'>
                    {teacher.isBlack && <p className='text-center text-red-500'>{teacher.name}</p>}
                    {!teacher.isBlack && <p className='text-center'>{teacher.name}</p>}
                  </td>
                  <td>
                    <p className='text-center'>{teacher.position}</p>
                  </td>
                  <td>
                    <p className='text-center'>
                      {
                        DEPARTMENTS.find((department) => department.id === teacher.departmentID)
                          ?.name
                      }
                    </p>
                  </td>
                  <td>
                    <p className='text-center'>{teacher.room}</p>
                  </td>
                  <td>
                    <p className='text-center'>{teacher.remark}</p>
                  </td>
                  <td>
                    <div className='flex items-center justify-center gap-3'>
                      <OpenEditModalButton
                        id={teacher.id || 0}
                        teacher={teacher}
                        isDisabled={isDisabled}
                      />
                      <OpenDeleteModalButton id={teacher.id || 0} isDisabled={isDisabled} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className='fixed bottom-4 right-4 md:hidden'>
        <OpenAddModalButton />
      </div>
    </MainLayout>
  );
}
