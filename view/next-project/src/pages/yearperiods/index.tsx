import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import OpenAddModalButton from '@/components/yearperiods/OpenAddModalButton';
import OpenDeleteModalButton from '@/components/yearperiods/OpenDeleteModalButton';
import OpenEditModalButton from '@/components/yearperiods/OpenEditModalButton';
import { useCurrentUser } from '@/store';
import { get } from '@api/api_methods';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout/MainLayout';
import { User, YearPeriod } from '@type/common';

interface Props {
  yearPeriods: YearPeriod[];
}

export const getServerSideProps = async () => {
  const getPeriodURL = process.env.SSR_API_URI + '/years/periods';
  const periodsRes = await get(getPeriodURL);

  return {
    props: {
      yearPeriods: periodsRes,
    },
  };
};

export default function Periods(props: Props) {
  const { yearPeriods } = props;
  const router = useRouter();

  const user = useCurrentUser();
  const [currentUser, setCurrentUser] = useState<User>();

  const formatYearPeriods =
    yearPeriods &&
    yearPeriods.map((yearPeriod) => {
      return {
        ...yearPeriod,
        startedAt: new Date(yearPeriod.startedAt).toLocaleDateString('ja'),
        endedAt: new Date(yearPeriod.endedAt).toLocaleDateString('ja'),
      };
    });

  useEffect(() => {
    setCurrentUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ログイン中のユーザの権限
  const isDeveloperOrAdimin = useMemo(() => {
    if (currentUser?.roleID === 2 || currentUser?.roleID === 3) {
      return true;
    } else {
      return false;
    }
  }, [currentUser?.roleID]);

  useEffect(() => {
    if (!currentUser?.roleID) return;
    if (!isDeveloperOrAdimin) {
      router.push('/purchaseorders');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeveloperOrAdimin, currentUser?.roleID]);

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
        <div className='
          hidden justify-end
          md:flex
        '>
          <OpenAddModalButton yearPeriods={props.yearPeriods}>年度登録</OpenAddModalButton>
        </div>
        <div className='mb-2 p-5'>
          <table className='mb-5 w-full table-auto border-collapse'>
            <thead>
              <tr>
                <th className='w-1/4 border-b border-b-primary-1 py-3'>
                  <p className='text-center text-sm text-black-600'>ID</p>
                </th>
                <th className='w-1/4 border-b border-b-primary-1 py-3'>
                  <p className='text-center text-sm text-black-600'>年度</p>
                </th>
                <th className='w-1/4 border-b border-b-primary-1 py-3'>
                  <p className='text-center text-sm text-black-600'>開始日</p>
                </th>
                <th className='w-1/4 border-b border-b-primary-1 py-3'>
                  <p className='text-center text-sm text-black-600'>終了日</p>
                </th>
                <th className='w-1/4 border-b border-b-primary-1 py-3'></th>
              </tr>
            </thead>
            <tbody>
              {formatYearPeriods &&
                formatYearPeriods.map((yearPeriod: YearPeriod, index) => (
                  <tr key={yearPeriod.id}>
                    <td
                      className={clsx(
                        'px-1 py-3',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === formatYearPeriods.length - 1 ? 'pt-3 pb-4' : `
                          border-b py-3
                        `,
                      )}
                    >
                      <p className='text-center text-sm text-black-600'>{yearPeriod.id}</p>
                    </td>
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === formatYearPeriods.length - 1 ? 'pt-3 pb-4' : `
                          border-b py-3
                        `,
                      )}
                    >
                      <p className='text-center text-sm text-black-600'>{yearPeriod.year}</p>
                    </td>
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === formatYearPeriods.length - 1 ? 'pt-3 pb-4' : `
                          border-b py-3
                        `,
                      )}
                    >
                      <p className='text-center text-sm text-black-600'>{yearPeriod.startedAt}</p>
                    </td>
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === formatYearPeriods.length - 1 ? 'pt-3 pb-4' : `
                          border-b py-3
                        `,
                      )}
                    >
                      <p className='text-center text-sm text-black-600'>{yearPeriod.endedAt}</p>
                    </td>
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === formatYearPeriods.length - 1 ? 'pt-3 pb-4' : `
                          border-b py-3
                        `,
                      )}
                    >
                      <div className='flex gap-2'>
                        <OpenEditModalButton yearPeriod={yearPeriod} yearPeriods={yearPeriods} />
                        <OpenDeleteModalButton
                          id={yearPeriod.id || 0}
                          isDisabled={false}
                          yearPeriod={yearPeriod}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              {!formatYearPeriods && (
                <tr className='border-b border-primary-1'>
                  <td className='px-1 py-3' colSpan={4}>
                    <div className='flex justify-center'>
                      <div className='text-sm text-black-600'>データがありません</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}
