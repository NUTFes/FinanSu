import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RiAddCircleLine } from 'react-icons/ri';

import { Card, Loading, PrimaryButton } from '@/components/common';
import MainLayout from '@/components/layout/MainLayout';
import TableSection from '@/components/mypage/TableSection';
import { useGetFestivalItemsDetailsUserId, useGetYearsPeriods } from '@/generated/hooks';
import { useCurrentUser } from '@/store';
import { User } from '@/type/common';

const MyPage = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const [currentUser, setCurrentUser] = useState<User>();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const {
    data: yearPeriodsData,
    isLoading: isYearPeriodsLoading,
    error: yearPeriodsError,
  } = useGetYearsPeriods();

  const yearPeriods = yearPeriodsData?.data;

  useEffect(() => {
    if (yearPeriods && yearPeriods.length > 0) {
      const latestYear = Math.max(...yearPeriods.map((yp) => yp.year));
      setSelectedYear(latestYear);
    }
  }, [yearPeriods]);

  const userId = currentUser?.id || 0;
  const { data, error, isLoading } = useGetFestivalItemsDetailsUserId(userId, {
    year: selectedYear,
  });

  const handleCreatePurchaseReport = () => {
    router.push({
      pathname: '/create_purchase_report',
      query: { year: selectedYear },
    });
  };

  if (isLoading || isYearPeriodsLoading) return <Loading />;
  if (error || yearPeriodsError) return <div>エラーが発生しました</div>;
  const resData = data?.data;
  return (
    <MainLayout>
      <Card>
        <div className='mx-5 mt-10 min-h-[calc(100vh-12rem)]'>
          <div className='mb-8 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h2 className='text-2xl font-thin text-black-300'>My Page</h2>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className='border-b border-black-300'
              >
                {yearPeriods?.map((yp) => (
                  <option key={yp.year} value={yp.year}>
                    {yp.year}年度
                  </option>
                ))}
              </select>
            </div>
            {resData && (
              <PrimaryButton onClick={handleCreatePurchaseReport}>
                <div className='flex items-center gap-2'>
                  購入報告
                  <RiAddCircleLine size={20} />
                </div>
              </PrimaryButton>
            )}
          </div>
          <div className='h-[calc(100%-5rem)] overflow-y-auto'>
            {resData &&
              resData.map((data, index) => <TableSection key={index} festivalItemDetails={data} />)}
          </div>
        </div>
      </Card>
    </MainLayout>
  );
};

export default MyPage;
