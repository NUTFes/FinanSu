import clsx from 'clsx';
import Head from 'next/head';
import { useState } from 'react';

import OpenDeleteModalButton from '@/components/sponsors/OpenDeleteModalButton';
import OpenEditModalButton from '@/components/sponsors/OpenEditModalButton';
import { useGetSponsorsPeriodsYear, useGetYearsPeriods } from '@/generated/hooks';
import { Card, Loading, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import OpenAddModalButton from '@components/sponsors/OpenAddModalButton';

import type { NextPage } from 'next';

const date = new Date();

const Sponsorship: NextPage = () => {
  const {
    data: yearPeriodsData,
    isLoading: isYearPeriodsLoading,
    error: yearPeriodsError,
  } = useGetYearsPeriods();
  const yearPeriods = yearPeriodsData?.data;

  const [selectedYear, setSelectedYear] = useState<string>(
    yearPeriods ? String(yearPeriods[yearPeriods.length - 1].year) : String(date.getFullYear()),
  );

  const {
    data: sponsorsData,
    isLoading: isSponsorsLoading,
    error: sponsorsError,
  } = useGetSponsorsPeriodsYear(Number(selectedYear));
  const sponsors = sponsorsData?.data;

  if (isYearPeriodsLoading || isSponsorsLoading) return <Loading />;
  if (yearPeriodsError || sponsorsError) return <div>error...</div>;

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
              {yearPeriods &&
                yearPeriods.map((year, index) => {
                  return (
                    <option value={year.year} key={index}>
                      {year.year}年度
                    </option>
                  );
                })}
            </select>
          </div>
          <div
            className='
              hidden justify-end
              md:flex
            '
          >
            <OpenAddModalButton>協賛企業登録</OpenAddModalButton>
          </div>
        </div>
        <div className='mb-2 overflow-scroll p-5'>
          <table
            className='
              mb-5 w-max table-auto border-collapse
              md:w-full md:table-fixed
            '
          >
            <thead>
              <tr className='border-b-primary-1 border-b py-3'>
                <th className='w-1/8 border-b-primary-1 pb-2'>
                  <div className='text-black-600 mr-1 text-center text-sm'>企業名</div>
                </th>
                <th className='w-1/8 border-b-primary-1 pb-2'>
                  <div className='text-black-600 text-center text-sm'>電話番号</div>
                </th>
                <th className='border-b-primary-1 w-1/6 pb-2'>
                  <div className='text-black-600 text-center text-sm'>メール</div>
                </th>
                <th className='border-b-primary-1 w-1/6 pb-2'>
                  <div className='text-center'>住所</div>
                </th>
                <th className='w-1/8 border-b-primary-1 pb-2'>
                  <div className='text-black-600 text-center'>代表者</div>
                </th>
                <th className='border-b-primary-1 w-1/12 pb-2'>
                  <div className='text-black-600 text-center'></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sponsors && sponsors.length > 0 ? (
                sponsors.map((sponsor, index) => (
                  <tr
                    className={clsx(index !== sponsors.length - 1 && 'border-b')}
                    key={sponsor.id}
                  >
                    <td className='py-3'>
                      <div className='text-black-300 text-center'>{sponsor.name}</div>
                    </td>
                    <td>
                      <div className='text-black-300 text-center'>{sponsor.tel}</div>
                    </td>
                    <td>
                      <div className='text-black-300 text-center'>{sponsor.email}</div>
                    </td>
                    <td>
                      <div className='text-black-300 text-center'>{sponsor.address}</div>
                    </td>
                    <td>
                      <div className='text-black-300 text-center'>{sponsor.representative}</div>
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
                    <div className='text-black-300 text-center'>データがありません</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <div
        className='
          fixed bottom-4 right-4
          md:hidden
        '
      >
        <OpenAddModalButton />
      </div>
    </MainLayout>
  );
};

export default Sponsorship;
