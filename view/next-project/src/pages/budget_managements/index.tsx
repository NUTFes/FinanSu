import BudgetManagement from '@/components/budget_managements/BudgetManagement';
import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  const departments = [
    { id: '1', name: '制作局', budget: 20000, used: 5000, remaining: 15000 },
    { id: '2', name: '渉外局', budget: 18000, used: 4000, remaining: 14000 },
    { id: '3', name: '企画局', budget: 22000, used: 6000, remaining: 16000 },
    { id: '4', name: '財務局', budget: 25000, used: 5500, remaining: 19500 },
    { id: '5', name: '情報局', budget: 21000, used: 7000, remaining: 14000 },
  ];

  const divisions = [
    { id: '1', name: '制作部門A', departmentId: '1', budget: 10000, used: 3000, remaining: 7000 },
    { id: '2', name: '制作部門B', departmentId: '1', budget: 10000, used: 2000, remaining: 8000 },
    { id: '3', name: '渉外部門A', departmentId: '2', budget: 9000, used: 4000, remaining: 5000 },
  ];

  const items = [
    { id: '1', name: '物品A', divisionId: '1', budget: 5000, used: 1000, remaining: 4000 },
    { id: '2', name: '物品B', divisionId: '1', budget: 5000, used: 500, remaining: 4500 },
    { id: '3', name: '物品C', divisionId: '2', budget: 6000, used: 1500, remaining: 4500 },
  ];

  return (
    <MainLayout>
      <BudgetManagement departments={departments} divisions={divisions} items={items} />
    </MainLayout>
  );
}
