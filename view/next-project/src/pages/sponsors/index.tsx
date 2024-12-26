import clsx from 'clsx';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import OpenDeleteModalButton from '@/components/sponsors/OpenDeleteModalButton';
import OpenEditModalButton from '@/components/sponsors/OpenEditModalButton';
import { useGetSponsorsPeriodsYear } from '@/generated/hooks';
import { get } from '@/utils/api/api_methods';
import { Card, Loading, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import OpenAddModalButton from '@components/sponsors/OpenAddModalButton';
import { Sponsor, YearPeriod } from '@type/common';

interface Props {
  sponsor: Sponsor[];
  yearPeriods: YearPeriod[];
}

const date = new Date();

export const getServerSideProps = async () => {
  const getPeriodsUrl = process.env.SSR_API_URI + '/years/periods';
  const periodsRes = await get(getPeriodsUrl);

  return {
    props: {
      yearPeriods: periodsRes,
    },
  };
};

const Sponsorship: NextPage<Props> = (props: Props) => {
  const yearPeriods = props.yearPeriods;
  const [selectedYear, setSelectedYear] = useState<string>(
    yearPeriods ? String(yearPeriods[yearPeriods.length - 1].year) : String(date.getFullYear()),
  );

  const { data, isLoading, error } = useGetSponsorsPeriodsYear(Number(selectedYear));
  // TODO 型アサーションしているため、openapiの型定義を修正する
  const sponsors = data?.data as Sponsor[];

  if (isLoading) return <Loading />;
  if (error) return <div>error...</div>;

  return (
    <MainLayout>
      <Head>
        <title>協賛企業一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card w='w-1/1'>
        <div className='mx-5 mt-10'>
          <div className='flex'>
            <Title title={'協賛企業一覧'} />
            <select
              className='w-100'
              defaultValue={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {props.yearPeriods &&
                props.yearPeriods.map((year) => {
                  return (
                    <option value={year.year} key={year.id}>
                      {year.year}年度
                    </option>
                  );
                })}
            </select>
          </div>
          <div className='hidden justify-end md:flex'>
            <OpenAddModalButton>協賛企業登録</OpenAddModalButton>
          </div>
        </div>
        <div className='mb-2 overflow-scroll p-5'>
          <table className='mb-5 w-max table-auto border-collapse md:w-full md:table-fixed'>
            <thead>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                <th className='w-1/8 border-b-primary-1 pb-2'>
                  <div className='mr-1 text-center text-sm text-black-600'>企業名</div>
                </th>
                <th className='w-1/8 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>電話番号</div>
                </th>
                <th className='w-1/6 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>メール</div>
                </th>
                <th className='w-1/6 border-b-primary-1 pb-2'>
                  <div className='text-center'>住所</div>
                </th>
                <th className='w-1/8 border-b-primary-1 pb-2'>
                  <div className='text-center text-black-600'>代表者</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-black-600'></div>
                </th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {sponsors && sponsors.length > 0 ? (
                sponsors.map((sponsor, index) => (
                  <tr
                    className={clsx(index !== sponsors.length - 1 && 'border-b')}
                    key={sponsor.id}
                  >
                    <td className='py-3'>
                      <div className='text-center text-black-300'>{sponsor.name}</div>
                    </td>
                    <td>
                      <div className='text-center text-black-300'>{sponsor.tel}</div>
                    </td>
                    <td>
                      <div className='text-center text-black-300'>{sponsor.email}</div>
                    </td>
                    <td>
                      <div className='text-center text-black-300'>{sponsor.address}</div>
                    </td>
                    <td>
                      <div className='text-center text-black-300'>{sponsor.representative}</div>
                    </td>
                    <td>
                      <div className='flex gap-3'>
                        <OpenEditModalButton sponsor={sponsor} />
                        <OpenDeleteModalButton id={sponsor.id || 0} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='py-3'>
                    <div className='text-center text-black-300'>データがありません</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <div className='fixed bottom-4 right-4 md:hidden'>
        <OpenAddModalButton />
      </div>
    </MainLayout>
  );
};

export default Sponsorship;
