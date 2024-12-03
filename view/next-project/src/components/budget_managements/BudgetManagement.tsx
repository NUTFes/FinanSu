import { useQueryStates, parseAsInteger } from 'nuqs';
import { useState, useEffect } from 'react';
import {
  Department,
  Division,
  Item,
  fetchDepartments,
  fetchDivisions,
  fetchItems,
} from './mockApi';
import { Card, EditButton, AddButton, Title } from '@/components/common';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';

export default function BudgetManagement() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const [{ departmentId, divisionId }, setQueryState] = useQueryStates({
    departmentId: parseAsInteger.withOptions({ history: 'push', shallow: true }),
    divisionId: parseAsInteger.withOptions({ history: 'push', shallow: true }),
  });

  useEffect(() => {
    fetchDepartments().then(setDepartments);
  }, []);

  // FIXME: APIが実装されたら、修正する。
  useEffect(() => {
    if (departmentId !== null) {
      fetchDivisions(departmentId).then(setDivisions);
      setItems([]);
    } else {
      setDivisions([]);
      setQueryState({ divisionId: null });
      setItems([]);
    }
  }, [departmentId]);

  useEffect(() => {
    if (divisionId !== null) {
      fetchItems(divisionId).then(setItems);
    } else {
      setItems([]);
    }
  }, [divisionId]);

  // FIXME: any型はAPIのレスポンスに合わせて変更する。
  let displayItems: any[] = [];
  let title = '購入報告';
  const showBudgetColumns = true;

  if (divisionId !== null) {
    displayItems = items;
    title = '申請物品';
  } else if (departmentId !== null) {
    displayItems = divisions;
    title = '申請部門';
  } else {
    displayItems = departments;
    title = '申請局';
  }

  const totalBudget = displayItems.reduce((sum, item) => sum + (item.budget || 0), 0);
  const totalUsed = displayItems.reduce((sum, item) => sum + (item.used || 0), 0);
  const totalRemaining = displayItems.reduce((sum, item) => sum + (item.remaining || 0), 0);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value ? parseInt(e.target.value, 10) : null;
    setQueryState({ departmentId: deptId, divisionId: null });
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const divId = e.target.value ? parseInt(e.target.value, 10) : null;
    setQueryState({ divisionId: divId });
  };

  // FIXME: any型はAPIのレスポンスに合わせて変更する。
  const handleRowClick = (item: any) => {
    if (departmentId === null) {
      setQueryState({ departmentId: item.id, divisionId: null });
    } else if (divisionId === null) {
      setQueryState({ divisionId: item.id });
    }
  };

  return (
    <Card>
      <div className='px-4 py-10'>
        <div className='flex-start mb-4 flex'>
          <Title>予算管理ページ</Title>
        </div>
        <div className='mb-4 flex flex-col items-center md:flex-row md:justify-between'>
          <div className='flex flex-col gap-4 text-nowrap py-2'>
            <div className='flex gap-3'>
              <span className='text-base font-light'>申請する局</span>
              <select
                value={departmentId ?? ''}
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
            <div className={`flex gap-3 ${departmentId !== null ? 'visible' : 'invisible'}`}>
              <span className='text-base font-light'>申請する部門</span>
              <select
                value={divisionId ?? ''}
                onChange={handleDivisionChange}
                className='border-b border-black-300 focus:outline-none'
              >
                <option value=''>ALL</option>
                {divisions.map((div) => (
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
          <table className='w-full table-auto border-collapse text-nowrap'>
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
                <tr
                  key={item.id}
                  className={`cursor-pointer ${
                    index !== displayItems.length - 1 ? 'border-b' : ''
                  }`}
                  onClick={() => handleRowClick(item)}
                >
                  <td className='flex justify-center gap-2 py-3'>
                    <div className='text-center text-primary-1 underline'>{item.name}</div>
                    <EditButton />
                  </td>

                  {showBudgetColumns && (
                    <>
                      <td className='py-3 text-center'>{item.budget}</td>
                      <td className='py-3 text-center'>{item.used}</td>
                      <td className='py-3 text-center'>{item.remaining}</td>
                    </>
                  )}
                </tr>
              ))}
              {showBudgetColumns && displayItems.length > 0 && (
                <tr className='border border-x-white-0 border-b-white-0 border-t-primary-1'>
                  <td className='py-3 text-center font-bold'>合計</td>
                  <td className='py-3 text-center font-bold'>{totalBudget}</td>
                  <td className='py-3 text-center font-bold'>{totalUsed}</td>
                  <td className='py-3 text-center font-bold'>{totalRemaining}</td>
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
