import clsx from 'clsx';
import Head from 'next/head';
import { useMemo, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authAtom } from '@/store/atoms';
import { getCurrentUser } from '@/utils/api/currentUser';
import { get } from '@api/api_methods';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import OpenAddModalButton from '@components/teacher/OpenAddModalButton';
import OpenDeleteModalButton from '@components/teacher/OpenDeleteModalButton';
import OpenEditModalButton from '@components/teacher/OpenEditModalButton';
import { Department, Teacher, User } from '@type/common';

interface Props {
  teachers: Teacher[];
  departments: Department[];
}

export const getServerSideProps = async () => {
  const getTeacherURL = process.env.SSR_API_URI + '/teachers';
  const getDepartmentURL = process.env.SSR_API_URI + '/departments';
  const teacherRes = await get(getTeacherURL);
  const departmentRes = await get(getDepartmentURL);
  return {
    props: {
      teachers: teacherRes,
      departments: departmentRes,
    },
  };
};
export default function TeachersList(props: Props) {
  const { teachers } = props;
  const departments = [
    {
      id: 0,
      name: '全て',
    },
    ...props.departments,
  ];
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(
    departments[0],
  );

  const auth = useRecoilValue(authAtom);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isDisabled = useMemo(() => {
    if (currentUser?.roleID === 2 || currentUser?.roleID === 3 || currentUser?.id === 4) {
      return false;
    } else {
      return true;
    }
  }, [currentUser?.roleID, currentUser?.id, currentUser]);

  const [filterTeachers, setFilterTeachers] = useState<Teacher[]>(teachers);

  useEffect(() => {
    const newFilterTeachers =
      selectedDepartment?.id === 0
        ? teachers
        : teachers.filter((teacher) => {
            return teacher.departmentID === selectedDepartment?.id;
          });
    setFilterTeachers(newFilterTeachers);
  }, [selectedDepartment]);

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
          <div className='flex flex-col md:flex-row'>
            <Title title={'教員一覧'} />
            <select
              className='md:w-100 mx-auto my-4 w-fit md:mx-10 md:my-0'
              value={selectedDepartment?.id}
              onChange={(e) => {
                const selectDepartment = departments.find((department) => {
                  return department?.id === Number(e.target.value);
                });
                setSelectedDepartment(selectDepartment);
              }}
            >
              {departments.map((department) => {
                return (
                  <option value={department?.id} key={department?.id}>
                    {department?.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className='hidden justify-end md:flex'>
            <OpenAddModalButton>教員登録</OpenAddModalButton>
          </div>
        </div>
        <div className='mb-2 overflow-scroll p-5'>
          <table className='mb-5 w-max table-auto border-collapse md:w-full'>
            <thead className='text-sm text-black-600'>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                <th className='w-1/6'>
                  <p>氏名</p>
                </th>
                <th className='w-1/6'>
                  <p>職位</p>
                </th>
                <th className='w-1/6'>
                  <p>学科</p>
                </th>
                <th className='w-1/6'>
                  <p>居室</p>
                </th>
                <th className='w-1/6'>
                  <p>備考</p>
                </th>
                <th className='w-1/6'></th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {filterTeachers &&
                filterTeachers.map((teacher, index) => (
                  <tr
                    key={index}
                    className={clsx(
                      index !== teachers.length - 1 && 'border-b',
                      'text-sm text-black-600',
                    )}
                  >
                    <td className='py-3'>
                      {teacher.isBlack && (
                        <p className='text-center text-red-500'>{teacher.name}</p>
                      )}
                      {!teacher.isBlack && <p className='text-center'>{teacher.name}</p>}
                    </td>
                    <td>
                      <p className='text-center'>{teacher.position}</p>
                    </td>
                    <td>
                      <p className='text-center'>
                        {
                          departments.find((department) => department.id === teacher.departmentID)
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
