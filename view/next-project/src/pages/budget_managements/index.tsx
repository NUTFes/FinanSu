import BudgetManagement from '@/components/budget_managements/BudgetManagement';
import AddBudgetManagementModal from '@/components/budget_managements/AddBudgetManagementModal';
import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      {/* <BudgetManagement /> */}
      <AddBudgetManagementModal />
    </MainLayout>
  );
}
