import { useState } from 'react';
import { Card, EditButton, AddButton, Title } from '@/components/common';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';

interface RegistrationItem {
  id: string;
  name: string;
  budget?: number;
  used?: number;
  remaining?: number;
}

interface Department {
  id: string;
  name: string;
  budget: number;
  used: number;
  remaining: number;
}

interface Division {
  id: string;
  name: string;
  departmentId: string;
  budget: number;
  used: number;
  remaining: number;
}

interface Item {
  id: string;
  name: string;
  divisionId: string;
  budget: number;
  used: number;
  remaining: number;
}

interface BudgetManagementProps {
  departments: Department[];
  divisions: Division[];
  items: Item[];
}

export default function BudgetManagement({ departments, divisions, items }: BudgetManagementProps) {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [selectedDivisionId, setSelectedDivisionId] = useState('');

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartmentId(e.target.value);
    setSelectedDivisionId('');
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDivisionId(e.target.value);
  };

  let displayItems: RegistrationItem[] = [];
  let title = '購入報告';
  const showBudgetColumns = true;

  if (selectedDivisionId) {
    displayItems = items.filter((item) => item.divisionId === selectedDivisionId);
    title = '申請物品';
  } else if (selectedDepartmentId) {
    displayItems = divisions.filter((div) => div.departmentId === selectedDepartmentId);
    title = '申請部門';
  } else {
    displayItems = departments;
    title = '申請局';
  }

  const totalBudget = displayItems.reduce((sum, item) => sum + (item.budget || 0), 0);
  const totalUsed = displayItems.reduce((sum, item) => sum + (item.used || 0), 0);
  const totalRemaining = displayItems.reduce((sum, item) => sum + (item.remaining || 0), 0);

  return (
    <Card>
      <div className='px-4 py-10'>
        <div className='flex-start mb-4 flex'>
          <Title>予算管理ページ</Title>
        </div>
        <div className='mb-4 flex flex-col items-center md:flex-row md:justify-between'>
          <div className='flex flex-col gap-4'>
            <div className='flex gap-3'>
              <span className='text-base font-light'>申請する局</span>
              <select
                value={selectedDepartmentId}
                onChange={handleDepartmentChange}
                className='border-b border-black-300 focus:outline-none'
              >
                <option value=''>ALL</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={`flex gap-3 ${selectedDepartmentId ? 'visible' : 'invisible'}`}>
              <span className='text-base font-light'>申請する部門</span>
              <select
                value={selectedDivisionId}
                onChange={handleDivisionChange}
                className='border-b border-black-300 focus:outline-none'
              >
                <option value=''>ALL</option>
                {divisions
                  .filter((div) => div.departmentId === selectedDepartmentId)
                  .map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className='mt-2 flex w-full flex-col gap-1 md:w-fit md:flex-row md:gap-3'>
            <PrimaryButton className='w-full md:w-fit'>CSVダウンロード</PrimaryButton>
            <AddButton className='w-full md:w-fit'>{title}登録</AddButton>
          </div>
        </div>
        <div className='mt-5 overflow-x-auto'>
          <table className='w-full table-auto border-collapse'>
            <thead>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                <th className='w-1/4 pb-2 text-center font-medium text-black-600'>{title}</th>
                {showBudgetColumns && (
                  <>
                    <th className='w-1/4 pb-2 text-center font-medium text-black-600'>予算</th>
                    <th className='w-1/4 pb-2 text-center font-medium text-black-600'>使用額</th>
                    <th className='w-1/4 pb-2 text-center font-medium text-black-600'>残高</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item, index) => (
                <tr key={item.id} className={index !== displayItems.length - 1 ? 'border-b' : ''}>
                  <td className='py-3'>
                    <div className='text-center text-sm text-black-600'>
                      <div className='flex items-center justify-center gap-2'>
                        <span className='text-nowrap text-primary-1 underline'>{item.name}</span>
                        <EditButton onClick={() => console.log('Edit clicked:', item.id)} />
                      </div>
                    </div>
                  </td>
                  {showBudgetColumns && (
                    <>
                      <td className='py-3'>
                        <div className='text-center text-sm text-black-600'>
                          {item.budget?.toLocaleString() || '-'}
                        </div>
                      </td>
                      <td className='py-3'>
                        <div className='text-center text-sm text-black-600'>
                          {item.used?.toLocaleString() || '-'}
                        </div>
                      </td>
                      <td className='py-3'>
                        <div className='text-center text-sm text-black-600'>
                          {item.remaining?.toLocaleString() || '-'}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {showBudgetColumns && displayItems.length > 0 && (
                <tr className='border border-x-white-0 border-b-white-0 border-t-primary-1'>
                  <td className='py-3'>
                    <div className='text-center text-sm text-black-600'>合計</div>
                  </td>
                  <td className='py-3'>
                    <div className='text-center text-sm text-black-600'>
                      {totalBudget.toLocaleString()}
                    </div>
                  </td>
                  <td className='py-3'>
                    <div className='text-center text-sm text-black-600'>
                      {totalUsed.toLocaleString()}
                    </div>
                  </td>
                  <td className='py-3'>
                    <div className='text-center text-sm text-black-600'>
                      {totalRemaining.toLocaleString()}
                    </div>
                  </td>
                </tr>
              )}
              {displayItems.length === 0 && (
                <tr>
                  <td
                    colSpan={showBudgetColumns ? 4 : 1}
                    className='text-gray-500 px-4 py-6 text-center text-sm'
                  >
                    データがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
