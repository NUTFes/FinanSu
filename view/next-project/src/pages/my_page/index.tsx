import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RiAddCircleLine } from 'react-icons/ri';

import { Card, Loading, PrimaryButton } from '@/components/common';
import MainLayout from '@/components/layout/MainLayout';
import TableSection from '@/components/mypage/TableSection';
import { useGetFestivalItemsDetailsUserId } from '@/generated/hooks';
import { useCurrentUser } from '@/store';
import { User } from '@/type/common';

const MyPage = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const userId = currentUser?.id || 0;
  const year = new Date().getFullYear();
  const { data, error, isLoading } = useGetFestivalItemsDetailsUserId(userId, {
    year,
  });

  const handleCreatePurchaseReport = () => {
    router.push('/create_purchase_report');
  };

  if (isLoading) return <Loading />;
  if (error) return <div>エラーが発生しました</div>;
  const resData = data?.data;
  return (
    <MainLayout>
      <Card>
        <div className='mx-5 mt-10 min-h-[calc(100vh-12rem)]'>
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='text-black-300 text-2xl font-thin'>My Page</h2>
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
