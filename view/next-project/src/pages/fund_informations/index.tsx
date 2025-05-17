import Head from 'next/head';
import router from 'next/router';
import { useRecoilValue } from 'recoil';

import { FundInformationTable, FundInformationHeader } from '@/components/fund_information';
import { useFundInformations } from '@/components/fund_information/useFundInformations';
import { userAtom } from '@/store/atoms';
import { Card } from '@components/common';
import MainLayout from '@components/layout/MainLayout';

export default function FundInformations() {
  const user = useRecoilValue(userAtom);

  user?.roleID === 1 && router.push('/my_page');

  const {
    fundInformations,
    isLoading,
    error,
    totalBalance,
    handleEdit,
    handleDelete,
    updateCheckBoxStatus,
  } = useFundInformations();

  return (
    <MainLayout>
      <Head>
        <title>収支管理</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-5 mt-10 min-h-[calc(100vh-12rem)]'>
          <div className='m-4'>
            <FundInformationHeader totalBalance={totalBalance} />
          </div>

          {error && <p className='p-5 text-center text-red-500'>{error}</p>}

          <div className='mb-2 w-full overflow-x-auto p-5'>
            {isLoading ? (
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
