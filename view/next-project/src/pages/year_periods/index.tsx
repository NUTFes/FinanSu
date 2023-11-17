import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import OpenAddModalButton from '@/components/year_periods/OpenAddModalButton';
import OpenDeleteModalButton from '@/components/year_periods/OpenDeleteModalButton';
import OpenEditModalButton from '@/components/year_periods/OpenEditModalButton';
import { authAtom } from '@/store/atoms';
import { getCurrentUser } from '@/utils/api/currentUser';
import { get } from '@api/api_methods';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout/MainLayout';
import { YearRecords, User } from '@type/common';

interface Props {
  yearRecords: YearRecords[];
}

export const getServerSideProps = async () => {
  const getPeriodURL = process.env.SSR_API_URI + '/years/periods';
  const periodsRes = await get(getPeriodURL);

  return {
    props: {
      yearRecords: periodsRes,
    },
  };
};

export default function Periods(props: Props) {
  const { yearRecords } = props;
  const router = useRouter();

  const auth = useRecoilValue(authAtom);
  const [currentUser, setCurrentUser] = useState<User>();

  const formatYearRecords = yearRecords.map((yearRecord) => {
    return {
      ...yearRecord,
      startedAt: yearRecord.startedAt && new Date(yearRecord.startedAt).toLocaleDateString('ja'),
      endedAt: yearRecord.endedAt && new Date(yearRecord.endedAt).toLocaleDateString('ja'),
    };
  });

  useEffect(() => {
    const getUser = async () => {
      const res = await getCurrentUser(auth);
      setCurrentUser(res);
    };
    getUser();
  }, []);

  // ログイン中のユーザの権限
  const isDeveloper = useMemo(() => {
    if (currentUser?.roleID === 2) {
      return true;
    } else {
      return false;
    }
  }, [currentUser?.roleID]);

  useEffect(() => {
    if (!currentUser?.roleID) return;
    if (!isDeveloper) {
      router.push('/purchaseorders');
    }
  }, [isDeveloper, currentUser?.roleID]);

  return (
    <MainLayout>
      <Head>
        <title>年度一覧</title>
        <meta name='description' content='ja' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Card>
        <div className='mx-5 mt-10'>
          <div className='flex'>
            <Title title={'年度一覧'} />
          </div>
        </div>
        <div className='hidden justify-end md:flex '>
          <OpenAddModalButton>年度登録</OpenAddModalButton>
        </div>
        <div className='mb-2 p-5'>
          <table className='mb-5 w-full table-auto border-collapse'>
            <thead>
              <tr>
                <th className='w-1/4 border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>ID</p>
                </th>
                <th className='w-1/4 border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>年度</p>
                </th>
                <th className='w-1/4 border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>開始日</p>
                </th>
                <th className='w-1/4 border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>終了日</p>
                </th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {formatYearRecords.map((yearRecord: YearRecords, index) => (
                <tr key={yearRecord.id}>
                  <td
                    className={clsx(
                      'px-1 py-3',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === yearRecords.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>{yearRecord.id}</p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === yearRecords.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>{yearRecord.year}</p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === yearRecords.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>{yearRecord.startedAt}</p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === yearRecords.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>{yearRecord.endedAt}</p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pb-3 pt-4' : 'py-3',
                      index === yearRecords.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <div className='flex gap-2'>
                      <OpenEditModalButton yearRecords={yearRecord} />
                      <OpenDeleteModalButton
                        id={yearRecord.id || 0}
                        isDisabled={false}
                        yearRecord={yearRecord}
                      />
                    </div>
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
