import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { TbDownload } from 'react-icons/tb';
import DownloadButton from '@/components/common/DownloadButton';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';
import { get } from '@api/api_methods';
import { Card, Checkbox, EditButton, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import OpenDeleteModalButton from '@components/purchasereports/OpenDeleteModalButton';
import { YearPeriod } from '@type/common';

// API実装後に削除する
const MOCK_BUY_REPORTS: BuyReport[] = [
  {
    id: 1,
    reportDate: '2023-11-24T10:00:00Z',
    financialRecordName: '情報局',
    divisionName: 'FinanSu',
    festivalItemName: '段ボール',
    paidBy: '技太太郎',
    amount: 2000000,
    isPacked: true,
    isSettled: true,
  },
  {
    id: 2,
    reportDate: '2023-11-23T10:00:00Z',
    financialRecordName: '情報局',
    divisionName: 'FinanSu',
    festivalItemName: '段ボール',
    paidBy: '技太太郎',
    amount: 2000,
    isPacked: true,
    isSettled: false,
  },
  {
    id: 3,
    reportDate: '2023-11-23T10:00:00Z',
    financialRecordName: '情報局',
    divisionName: 'FinanSu',
    festivalItemName: '段ボール',
    paidBy: '技太太郎',
    amount: 2000,
    isPacked: false,
    isSettled: false,
  },
  {
    id: 4,
    reportDate: '2023-11-23T10:00:00Z',
    financialRecordName: '情報局',
    divisionName: 'FinanSu',
    festivalItemName: '段ボール',
    paidBy: '技太太郎',
    amount: 2000,
    isPacked: true,
    isSettled: false,
  },
  {
    id: 5,
    reportDate: '2023-11-22T10:00:00Z',
    financialRecordName: '情報局',
    divisionName: 'FinanSu',
    festivalItemName: '段ボール',
    paidBy: '技太太郎',
    amount: 2000,
    isPacked: true,
    isSettled: false,
  },
  {
    id: 6,
    reportDate: '2023-11-22T10:00:00Z',
    financialRecordName: '情報局',
    divisionName: 'FinanSu',
    festivalItemName: '段ボール',
    paidBy: '技太太郎',
    amount: 2000,
    isPacked: true,
    isSettled: false,
  },
  {
    id: 7,
    reportDate: '2023-11-22T10:00:00Z',
    financialRecordName: '情報局',
    divisionName: 'FinanSu',
    festivalItemName: '段ボール',
    paidBy: '技太太郎',
    amount: 2000,
    isPacked: true,
    isSettled: false,
  },
  {
    id: 8,
    reportDate: '2023-11-22T10:00:00Z',
    financialRecordName: '情報局',
    divisionName: 'FinanSu',
    festivalItemName: '段ボール',
    paidBy: '技太太郎',
    amount: 2000,
    isPacked: true,
    isSettled: false,
  },
];

interface BuyReport {
  amount: number;
  divisionName: string;
  festivalItemName: string;
  financialRecordName: string;
  id: number;
  isPacked: boolean;
  isSettled: boolean;
  paidBy: string;
  reportDate: string;
}

export async function getServerSideProps() {
  const getPurchaseReportsUrl = process.env.SSR_API_URI + '/years/periods';
  const periodsRes = await get(getPurchaseReportsUrl);
  return {
    props: {
      yearPeriods: periodsRes,
    },
  };
}

export default function PurchaseReports({ yearPeriods }: { yearPeriods: YearPeriod[] }) {
  const router = useRouter();
  const [reports] = useState<BuyReport[]>(MOCK_BUY_REPORTS);
  const [selectedYear, setSelectedYear] = useState<string>(String(yearPeriods[0].year));
  const [sealChecks, setSealChecks] = useState<Record<number, boolean>>(
    Object.fromEntries(MOCK_BUY_REPORTS.map((report) => [report.id, report.isPacked])),
  );
  const [settlementChecks, setSettlementChecks] = useState<Record<number, boolean>>(
    Object.fromEntries(MOCK_BUY_REPORTS.map((report) => [report.id, report.isSettled])),
  );

  const formatDate = useCallback((date: string) => {
    const datetime = date.replace('T', ' ');
    return datetime.substring(5, datetime.length - 10).replace('-', '/');
  }, []);

  const formatAmount = useCallback((amount: number) => {
    return amount.toLocaleString();
  }, []);

  const updateSealCheck = (id: number) => {
    setSealChecks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const updateSettlementCheck = (id: number) => {
    setSettlementChecks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEdit = (report: BuyReport) => {
    router.push({
      pathname: '/create_purchase_report',
      query: {
        from: 'purchase_report_list',
        reportId: report.id,
        festivalItemName: report.festivalItemName,
        amount: report.amount,
        paidBy: report.paidBy,
      },
    });
  };

  return (
    <MainLayout>
      <div className='flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4'>
        <Card w='flex flex-col w-full md:w-fit'>
          <div className='mx-4 mt-8 md:mx-8 md:mt-16'>
            <div className='flex flex-col items-center gap-6 md:flex-row'>
              <Title title={'購入報告一覧'} />
              <select
                className='border-b border-black-0'
                defaultValue={selectedYear}
                onChange={async (e) => {
                  setSelectedYear(e.target.value);
                }}
              >
                {yearPeriods &&
                  yearPeriods.map((year) => {
                    return (
                      <option className='w-fit' value={year.year} key={year.id}>
                        {year.year}年度
                      </option>
                    );
                  })}
              </select>
              <PrimaryButton className='w-fit items-center'>
                CSVダウンロード
                <TbDownload className='ml-2' size={20} />
              </PrimaryButton>
            </div>
          </div>
          <div className='mt-2 flex-1 overflow-auto p-4 md:p-8'>
            <div className='min-w-max'>
              <table className='mb-5 table-auto border-collapse'>
                <thead>
                  <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                    <th className='whitespace-nowrap px-4 pb-2 text-sm font-normal text-black-600'>
                      日付
                    </th>
                    <th className='whitespace-nowrap px-4 pb-2 text-sm font-normal text-black-600'>
                      局名
                    </th>
                    <th className='whitespace-nowrap px-4 pb-2 text-sm font-normal text-black-600'>
                      部門
                    </th>
                    <th className='whitespace-nowrap px-4 pb-2 text-sm font-normal text-black-600'>
                      物品
                    </th>
                    <th className='whitespace-nowrap px-4 pb-2 text-sm font-normal text-black-600'>
                      立替者
                    </th>
                    <th className='whitespace-nowrap px-4 pb-2 text-sm font-normal text-black-600'>
                      金額
                    </th>
                    <th className='whitespace-nowrap px-4 pb-2 text-sm font-normal text-black-600'>
                      封詰め
                    </th>
                    <th className='whitespace-nowrap px-4 pb-2 text-sm font-normal text-black-600'>
                      清算完了
                    </th>
                    <th className='whitespace-nowrap px-4 pb-2 text-sm text-black-600'></th>
                  </tr>
                </thead>
                <tbody>
                  {reports && reports.length > 0 ? (
                    reports.map((report) => (
                      <tr key={report.id}>
                        <td className='whitespace-nowrap px-4 py-3 text-center text-sm text-black-600'>
                          {formatDate(report.reportDate)}
                        </td>
                        <td className='whitespace-nowrap px-4 py-3 text-center text-sm text-black-600'>
                          {report.financialRecordName}
                        </td>
                        <td className='whitespace-nowrap px-4 py-3 text-center text-sm text-black-600'>
                          {report.divisionName}
                        </td>
                        <td className='whitespace-nowrap px-4 py-3 text-center text-sm text-black-600'>
                          {report.festivalItemName}
                        </td>
                        <td className='whitespace-nowrap px-4 py-3 text-center text-sm text-black-600'>
                          {report.paidBy}
                        </td>
                        <td className='whitespace-nowrap px-4 py-3 text-center text-sm text-black-600'>
                          {formatAmount(report.amount)}
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <Checkbox
                            className='accent-primary-5'
                            checked={sealChecks[report.id] || false}
                            onChange={() => updateSealCheck(report.id)}
                          />
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <Checkbox
                            className='accent-primary-5'
                            checked={settlementChecks[report.id] || false}
                            onChange={() => updateSettlementCheck(report.id)}
                          />
                        </td>
                        <td>
                          <div className='flex'>
                            <div className='mx-1'>
                              <DownloadButton tooltip='レシートダウンロード' />
                            </div>
                            <div className='mx-1'>
                              <EditButton
                                isDisabled={sealChecks[report.id] && settlementChecks[report.id]}
                                onClick={() => handleEdit(report)}
                              />
                            </div>
                            <div className='mx-1'>
                              <OpenDeleteModalButton
                                id={report.id}
                                isDisabled={sealChecks[report.id] && settlementChecks[report.id]}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className='border-b border-primary-1 px-1 py-3' colSpan={9}>
                        <div className='text-center text-sm text-black-600'>データがありません</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
