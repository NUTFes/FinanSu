import clsx from 'clsx';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

import { useClientSideData } from '@/hooks/useClientSideData';
import { useCurrentUser } from '@/store';
import { getList } from '@api/api_methods';
import { Card, Loading, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import OpenAddModalButton from '@components/teacher/OpenAddModalButton';
import OpenDeleteModalButton from '@components/teacher/OpenDeleteModalButton';
import OpenEditModalButton from '@components/teacher/OpenEditModalButton';
import { Department, Teacher, User } from '@type/common';

const ALL_DEPARTMENTS: Department = { id: 0, name: '全て' };

export default function TeachersList() {
  const { data, isLoading } = useClientSideData(async () => {
    const [teacherRes, departmentRes] = await Promise.all([
      getList<Teacher>(process.env.CSR_API_URI + '/teachers'),
      getList<Department>(process.env.CSR_API_URI + '/departments'),
    ]);
    return { teachers: teacherRes, departments: departmentRes };
  });
  const teachers = useMemo(() => data?.teachers ?? [], [data]);
  const fetchedDepartments = useMemo(() => data?.departments ?? [], [data]);
  const departments = useMemo(() => [ALL_DEPARTMENTS, ...fetchedDepartments], [fetchedDepartments]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(
    ALL_DEPARTMENTS,
  );

  const user = useCurrentUser();
  const [currentUser, setCurrentUser] = useState<User>();
  const isDisabled = !(
    currentUser?.roleID === 2 ||
    currentUser?.roleID === 3 ||
    currentUser?.id === 4
  );
  const [filterTeachers, setFilterTeachers] = useState<Teacher[]>([]);

  const [deleteTeachers, setDeleteTeachers] = useState<{ teachers: Teacher[]; ids: number[] }>({
    teachers: [],
    ids: [],
  });

  useEffect(() => {
    setCurrentUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newFilterTeachers =
      selectedDepartment?.id === 0
        ? teachers
        : teachers.filter((teacher) => {
            return teacher.departmentID === selectedDepartment?.id;
          });
    setFilterTeachers(newFilterTeachers);
  }, [selectedDepartment, teachers]);

  if (isLoading) return <Loading />;

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
              className='mx-auto my-4 w-fit md:mx-10 md:my-0 md:w-100'
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
            <OpenAddModalButton departments={fetchedDepartments}>教員登録</OpenAddModalButton>
          </div>
        </div>
        <div className='mb-2 overflow-scroll p-5'>
          <table className='mb-5 w-max table-auto border-collapse md:w-full'>
            <thead className='text-black-600 text-sm'>
              <tr className='border-b-primary-1 border-b py-3'>
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
                <th className='w-1/7'>
                  <p>備考</p>
                </th>
                <th className='w-1/12' />
                <th className='w-1/12'>
                  <div className='flex justify-center'>
                    <OpenDeleteModalButton
                      deleteTeachers={deleteTeachers}
                      isDisabled={deleteTeachers.ids.length == 0}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filterTeachers &&
                filterTeachers.map((teacher, index) => (
                  <tr
                    key={index}
                    className={clsx(
                      index !== teachers.length - 1 && 'border-b',
                      'text-black-600 text-sm',
                    )}
                  >
                    <td className='py-3 text-center'>
                      {teacher.isBlack ? (
                        <p className='text-red-500'>{teacher.name}</p>
                      ) : (
                        <p>{teacher.name}</p>
                      )}
                    </td>
                    <td className='text-center'>
                      <p>{teacher.position}</p>
                    </td>
                    <td className='text-center'>
                      <p>
                        {
                          departments.find((department) => department.id === teacher.departmentID)
                            ?.name
                        }
                      </p>
                    </td>
                    <td className='text-center'>
                      <p>{teacher.room}</p>
                    </td>
                    <td className='text-center'>
                      <p>{teacher.remark}</p>
                    </td>
                    <td className='text-center'>
                      <div className='flex justify-end'>
                        <OpenEditModalButton
                          id={teacher.id || 0}
                          teacher={teacher}
                          isDisabled={isDisabled}
                          departments={fetchedDepartments}
                        />
                      </div>
                    </td>
                    <td className='text-center'>
                      <div className='flex justify-center'>
                        <input
                          checked={deleteTeachers.ids.includes(teacher.id || 0)}
                          type='checkbox'
                          onChange={(_e) => {
                            deleteTeachers.ids.includes(teacher.id || 0)
                              ? setDeleteTeachers({
                                  teachers: deleteTeachers.teachers.filter((selectedTeacher) => {
                                    return selectedTeacher.id !== teacher.id;
                                  }),
                                  ids: deleteTeachers.ids.filter((selectedID) => {
                                    return selectedID !== teacher.id;
                                  }),
                                })
                              : setDeleteTeachers({
                                  teachers: [...deleteTeachers.teachers, teacher],
                                  ids: [...(deleteTeachers.ids || []), teacher.id || 0],
                                });
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className='fixed right-4 bottom-4 md:hidden'>
        <OpenAddModalButton departments={fetchedDepartments} />
      </div>
    </MainLayout>
  );
}
