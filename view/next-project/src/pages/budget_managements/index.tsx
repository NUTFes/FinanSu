import router from 'next/router';

import BudgetManagement from '@/components/budget_managements/BudgetManagement';
import { Loading } from '@/components/common';
import MainLayout from '@/components/layout/MainLayout';
import { useClientSideData } from '@/hooks/useClientSideData';
import { useCurrentUser } from '@/store';
import { Year } from '@/type/common';
import { getList } from '@/utils/api/api_methods';

export default function Home() {
  const user = useCurrentUser();
  const { data, isLoading } = useClientSideData(() =>
    getList<Year>(process.env.CSR_API_URI + '/years'),
  );

  user?.roleID === 1 && router.push('/my_page');

  if (isLoading) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <BudgetManagement years={data ?? []} />
    </MainLayout>
  );
}
