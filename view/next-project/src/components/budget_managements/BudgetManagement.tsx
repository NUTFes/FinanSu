import { useQueryStates, parseAsInteger } from 'nuqs';
import { useEffect, useState } from 'react';
import OpenAddModalButton from '@/components/budget_managements/OpenAddModalButton';
import { Card, EditButton, Title, Loading } from '@/components/common';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';
import { useGetDivisions, useGetFestivalItems, useGetFinancialRecords } from '@/generated/hooks';
import type {
  Division,
  FinancialRecord,
  GetDivisionsParams,
  GetFestivalItemsParams,
} from '@/generated/model';
import { Year } from '@/type/common';
import { get } from '@/utils/api/api_methods';

interface FinancialRecordWithId extends FinancialRecord {
  id: number;
}

interface DivisionWithId extends Division {
  id: number;
}

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

export default function BudgetManagement(props: Props) {
  const { years } = props;
  const [{ financialRecordId, divisionId, festivalItemId }, setQueryState] = useQueryStates({
    financialRecordId: parseAsInteger.withOptions({ history: 'push', shallow: true }),
    divisionId: parseAsInteger.withOptions({ history: 'push', shallow: true }),
    festivalItemId: parseAsInteger.withOptions({ history: 'push', shallow: true }),
  });
  const divisionsParams: GetDivisionsParams = {
    financial_record_id: financialRecordId ?? undefined,
  };
  const festivalItemsParams: GetFestivalItemsParams = {
    division_id: divisionId ?? undefined,
  };

  const [selectedYear, setSelectedYear] = useState<Year>(
    years ? years[years.length - 1] : { id: 3, year: 2025 },
  );

  const {
    data: financialRecordData,
    isLoading: isFinancialRecordLoading,
    error: financialRecordError,
  } = useGetFinancialRecords();
  const {
    data: divisionsData,
    isLoading: isDivisionsLoading,
    error: divisionsError,
  } = useGetDivisions(divisionsParams);
  const {
    data: festivalItemsData,
    isLoading: isFestivalItemsLoading,
    error: festivalItemsError,
  } = useGetFestivalItems(festivalItemsParams);

  const { financialRecords = [], total: financialRecordsTotal } = financialRecordData?.data || {};
  const { divisions = [], total: divisionsTotal } = divisionsData?.data || {};
  const { festivalItems = [], total: festivalItemsTotal } = festivalItemsData?.data || {};

  let displayItems = [];
  let title = '購入報告';
  const showBudgetColumns = true;
  const [pahse, setPahse] = useState<number>(1);
  const [fr, setFr] = useState<FinancialRecordWithId>();
  const [div, setDiv] = useState<DivisionWithId>();

  let totalBudget = 0;
  let totalExpense = 0;
  let totalBalance = 0;

  const handleFinancialRecordChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const frId = e.target.value ? parseInt(e.target.value, 10) : null;
    setQueryState({ financialRecordId: frId, divisionId: null, festivalItemId: null });
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const divId = e.target.value ? parseInt(e.target.value, 10) : null;
    setQueryState({ divisionId: divId, festivalItemId: null });
  };

  useEffect(() => {
    if (financialRecordId === null) {
      setPahse(1);
      const recordWithId: FinancialRecordWithId = {
        id: 0,
        year_id: selectedYear.id ?? 3,
        name: '',
      };
      setFr(recordWithId);
    } else if (divisionId === null) {
      setPahse(2);
      const foundRecord = financialRecords.find((fr) => fr.id === financialRecordId);
      if (foundRecord) {
        // FinancialRecordWithId に変換する
        const recordWithId: FinancialRecordWithId = {
          ...foundRecord,
          id: foundRecord.id ?? 0,
          year_id: selectedYear.id ?? 3,
          name: foundRecord.name ?? '',
        };
        setFr(recordWithId);
      }
      const divisionWithId: DivisionWithId = {
        id: 0,
        financialRecordID: financialRecordId ?? 0,
        name: '',
      };
      setDiv(divisionWithId);
    } else {
      setPahse(3);
      const foundRecord = financialRecords.find((fr) => fr.id === financialRecordId);
      if (foundRecord) {
        // FinancialRecordWithId に変換する
        const recordWithId: FinancialRecordWithId = {
          ...foundRecord,
          id: foundRecord.id ?? 0,
          year_id: selectedYear.id ?? 3,
          name: foundRecord.name ?? '',
        };
        setFr(recordWithId);
      }
      const foundDivison = divisions.find((div) => div.id === divisionId);
      if (foundDivison) {
        // FinancialRecordWithId に変換する
        const divisionWithId: DivisionWithId = {
          ...foundDivison,
          id: foundDivison.id ?? 0,
          financialRecordID: financialRecordId ?? 0,
          name: foundDivison.name ?? '',
        };
        setDiv(divisionWithId);
      }
    }
  }, [financialRecordId, divisionId, selectedYear.id, financialRecords, divisions]);

  const handleRowClick = (item: any) => {
    if (financialRecordId === null) {
      setQueryState({ financialRecordId: item.id, divisionId: null, festivalItemId: null });
      return;
    }
    if (divisionId === null) {
      setQueryState({ divisionId: item.id, festivalItemId: null });
      return;
    }
    if (festivalItemId === null && festivalItems.length) {
      setQueryState({ festivalItemId: item.id });
    }
  };

  if (divisionId !== null) {
    displayItems = festivalItems;
    title = '申請物品';
    totalBudget = festivalItemsTotal?.budget || 0;
    totalExpense = festivalItemsTotal?.expense || 0;
    totalBalance = festivalItemsTotal?.balance || 0;
  } else if (financialRecordId !== null) {
    displayItems = divisions;
    title = '申請部門';
    totalBudget = divisionsTotal?.budget || 0;
    totalExpense = divisionsTotal?.expense || 0;
    totalBalance = divisionsTotal?.balance || 0;
  } else {
    displayItems = financialRecords;
    title = '申請局';
    totalBudget = financialRecordsTotal?.budget || 0;
    totalExpense = financialRecordsTotal?.expense || 0;
    totalBalance = financialRecordsTotal?.balance || 0;
  }

  // 3桁ごとにカンマを付けるフォーマッタ
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US'); // ロケールに合わせて変更可能
  };

  const isLoadingAll = isFinancialRecordLoading || isDivisionsLoading || isFestivalItemsLoading;
  if (isLoadingAll) {
    return <Loading />;
  }

  const isErrorOccurred = financialRecordError || divisionsError || festivalItemsError;
  if (isErrorOccurred) {
    return <div>error...</div>;
  }

  return (
    <Card>
      <div className='px-4 py-10'>
        <div className='flex-start mb-4 flex'>
          <Title>予算管理ページ</Title>
        </div>
        <div className='mb-4 flex flex-col items-center md:flex-row md:justify-between'>
          <div className='flex flex-col gap-4 py-2'>
            <div className='flex gap-3'>
              <span className='text-base font-light'>申請する局</span>
              <select
                value={financialRecordId ?? ''}
                onChange={handleFinancialRecordChange}
                className='border-b border-black-300 focus:outline-none'
              >
                <option value=''>ALL</option>
                {financialRecords &&
                  financialRecords.map((financialRecord) => (
                    <option key={financialRecord.id} value={financialRecord.id}>
                      {financialRecord.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className={`flex gap-3 ${financialRecordId !== null ? 'visible' : 'invisible'}`}>
              <span className='text-base font-light'>申請する部門</span>
              <select
                value={divisionId ?? ''}
                onChange={handleDivisionChange}
                className='border-b border-black-300 focus:outline-none'
              >
                <option value=''>ALL</option>
                {divisions &&
                  divisions.map((division) => (
                    <option key={division.id} value={division.id}>
                      {division.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className='mt-2 flex w-full flex-col gap-1 md:w-fit md:flex-row md:gap-3'>
            <PrimaryButton className='w-full md:w-fit'>CSVダウンロード</PrimaryButton>
            <OpenAddModalButton
              className='w-full md:w-fit'
              phase={pahse}
              year={selectedYear}
              fr={fr}
              div={div}
            >
              {title}登録
            </OpenAddModalButton>
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
              {displayItems &&
                displayItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`cursor-pointer ${
                      index !== displayItems.length - 1 ? 'border-b' : ''
                    }`}
                    onClick={() => handleRowClick(item)}
                  >
                    <td className='flex justify-center gap-2 py-3'>
                      <div className='text-center text-primary-1'>{item.name}</div>
                      <EditButton />
                    </td>
                    {showBudgetColumns && (
                      <>
                        <td className='py-3 text-center'>{formatNumber(item.budget ?? 0) ?? 0}</td>
                        <td className='py-3 text-center'>{formatNumber(item.expense ?? 0) ?? 0}</td>
                        <td className='py-3 text-center'>{formatNumber(item.balance ?? 0) ?? 0}</td>
                      </>
                    )}
                  </tr>
                ))}
              {showBudgetColumns && displayItems && displayItems.length > 0 && (
                <tr className='border border-x-white-0 border-b-white-0 border-t-primary-1'>
                  <td className='py-3 text-center font-bold'>合計</td>
                  <td className='py-3 text-center font-bold'>{formatNumber(totalBudget)}</td>
                  <td className='py-3 text-center font-bold'>{formatNumber(totalExpense)}</td>
                  <td className='py-3 text-center font-bold'>{formatNumber(totalBalance)}</td>
                </tr>
              )}
              {displayItems && displayItems.length === 0 && (
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
