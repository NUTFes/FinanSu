import clsx from 'clsx';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store/atoms';
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

  const user = useRecoilValue(userAtom);
  const [currentUser, setCurrentUser] = useState<User>();
  const isDisabled = !(
    currentUser?.roleID === 2 ||
    currentUser?.roleID === 3 ||
    currentUser?.id === 4
  );
  const [filterTeachers, setFilterTeachers] = useState<Teacher[]>(teachers);

  const [deleteTeachers, setDeleteTeachers] = useState<{ teachers: Teacher[]; ids: number[] }>({
    teachers: [],
    ids: [],
  });

  useEffect(() => {
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const newFilterTeachers =
      selectedDepartment?.id === 0
        ? teachers
        : teachers.filter((teacher) => {
            return teacher.departmentID === selectedDepartment?.id;
          });
    setFilterTeachers(newFilterTeachers);
  }, [selectedDepartment]);

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
            <OpenAddModalButton departments={props.departments}>教員登録</OpenAddModalButton>
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
                          departments={props.departments}
                        />
                      </div>
                    </td>
                    <td className='text-center'>
                      <div className='flex justify-center'>
                        <input
                          checked={deleteTeachers.ids.includes(teacher.id || 0)}
                          type='checkbox'
                          onChange={(e) => {
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
      <div className='fixed bottom-4 right-4 md:hidden'>
        <OpenAddModalButton departments={props.departments} />
      </div>
    </MainLayout>
  );
}
