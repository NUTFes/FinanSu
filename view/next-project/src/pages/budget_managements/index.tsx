import BudgetManagement from '@/components/budget_managements/BudgetManagement';
import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <BudgetManagement />
    </MainLayout>
  );
}
