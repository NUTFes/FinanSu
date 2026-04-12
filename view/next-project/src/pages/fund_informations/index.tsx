import Head from 'next/head';
import router from 'next/router';
import { useEffect, useState } from 'react';

import { FundInformationHeader, FundInformationTable } from '@/components/fund_information';
import { useFundInformations } from '@/components/fund_information/useFundInformations';
import { useGetYearsPeriods } from '@/generated/hooks';
import { useCurrentUser } from '@/store';
import { Card } from '@components/common';
import MainLayout from '@components/layout/MainLayout';

export default function FundInformations() {
  const user = useCurrentUser();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const {
    data: yearPeriodsData,
    isLoading: isYearPeriodsLoading,
    error: yearPeriodsError,
  } = useGetYearsPeriods();

  const yearPeriods = yearPeriodsData?.data;

  user?.roleID === 1 && router.push('/my_page');

  useEffect(() => {
    if (yearPeriods && yearPeriods.length > 0) {
      const latestYear = Math.max(...yearPeriods.map((yp) => yp.year));
      setSelectedYear(latestYear);
    }
  }, [yearPeriods]);

  const {
    fundInformations,
    isLoading,
    error,
    totalBalance,
    handleEdit,
    handleDelete,
    updateCheckBoxStatus,
  } = useFundInformations({ selectedYear });

  const isPageLoading = isLoading || isYearPeriodsLoading;
  const pageError = error || (yearPeriodsError ? '年度情報の取得に失敗しました' : null);

  return (
    <MainLayout>
      <Head>
        <title>収支管理</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-5 mt-10 min-h-[calc(100vh-12rem)]'>
          <div className='m-4'>
            <FundInformationHeader
              totalBalance={totalBalance}
              selectedYear={selectedYear}
              yearPeriods={yearPeriods}
              onYearChange={setSelectedYear}
            />
          </div>

          {pageError && <p className='p-5 text-center text-red-500'>{pageError}</p>}

          <div className='mb-2 w-full overflow-x-auto p-5'>
            {isPageLoading ? (
              <p className='py-10 text-center'>データを読み込み中...</p>
            ) : (
              <FundInformationTable
                fundInformations={fundInformations}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCheckChange={updateCheckBoxStatus}
              />
            )}
          </div>
        </div>
      </Card>
    </MainLayout>
  );
}
