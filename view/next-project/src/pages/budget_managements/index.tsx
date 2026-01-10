import router from 'next/router';
import { useRecoilValue } from 'recoil';

import BudgetManagement from '@/components/budget_managements/BudgetManagement';
import MainLayout from '@/components/layout/MainLayout';
import { userAtom } from '@/store/atoms';
import { Year } from '@/type/common';
import { get } from '@/utils/api/api_methods';

interface Props {
  years: Year[];
}

export async function getServerSideProps() {
  const getYearUrl = process.env.SSR_API_URI + '/years';
  const yearRes = await get(getYearUrl);
  return {
    props: {
      years: yearRes,
    },
  };
}

export default function Home(props: Props) {
  const user = useRecoilValue(userAtom);
  user?.roleID === 1 && router.push('/my_page');
  return (
    <MainLayout>
      <BudgetManagement years={props.years} />
    </MainLayout>
  );
}
