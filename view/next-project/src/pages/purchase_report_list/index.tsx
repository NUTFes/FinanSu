import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Portal,
  Text,
  Select,
} from '@chakra-ui/react';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/router';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { BsFilter } from 'react-icons/bs';
import { TbDownload } from 'react-icons/tb';
import { useRecoilValue } from 'recoil';
import DownloadButton from '@/components/common/DownloadButton';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';
import { OpenCheckSettlementModalButton } from '@/components/purchasereports';
import {
  useGetBuyReportsDetails,
  useGetYearsPeriods,
  usePutBuyReportStatusBuyReportId,
  useGetUsers,
  useGetBureaus,
} from '@/generated/hooks';
import type {
  GetBuyReportsDetailsParams,
  BuyReportDetail,
  PutBuyReportStatusBuyReportIdBody,
} from '@/generated/model';
import { userAtom } from '@/store/atoms';
import { User, Bureau } from '@/type/common';
import { Card, Checkbox, EditButton, Loading, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import OpenDeleteModalButton from '@components/purchasereports/OpenDeleteModalButton';

export default function PurchaseReports() {
  const router = useRouter();
  const {
    data: yearPeriodsData,
    isLoading: isYearPeriodsLoading,
    error: yearPeriodsError,
  } = useGetYearsPeriods();
  const yearPeriods = yearPeriodsData?.data;
  const user = useRecoilValue(userAtom);

  user?.roleID === 1 && router.push('/my_page');

  useEffect(() => {
    if (yearPeriods && yearPeriods.length > 0) {
      const latestYear = Math.max(...yearPeriods.map((period) => period.year));
      setSelectedYear(latestYear);
    }
  }, [yearPeriods]);

  const [selectedYear, setSelectedYear] = useState<number>(
    yearPeriods && yearPeriods.length > 0 ? yearPeriods[yearPeriods.length - 1].year : 0,
  );
  const getBuyReportsDetailsParams: GetBuyReportsDetailsParams = { year: selectedYear };

  const {
    data: buyReportsData,
    isLoading: isBuyReportsLoading,
    error: buyReportsError,
    mutate: mutateBuyReportData,
  } = useGetBuyReportsDetails(getBuyReportsDetailsParams);

  // ユーザーと局の情報を取得
  const { data: usersData } = useGetUsers();
  const { data: bureausData } = useGetBureaus();

  const users = useMemo(() => (usersData?.data as unknown as User[]) || [], [usersData]);
  const bureaus = useMemo(() => (bureausData?.data as unknown as Bureau[]) || [], [bureausData]);

  const [sealChecks, setSealChecks] = useState<Record<number, boolean>>({});
  const [settlementChecks, setSettlementChecks] = useState<Record<number, boolean>>({});

  // フィルタとソートの状態
  const [filterPayer, setFilterPayer] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'bureau' | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // フィルタリングとソート済みのデータ
  const processedBuyReports = useMemo(() => {
    let reports = buyReportsData?.data ?? [];

    // フィルタリング
    if (filterPayer) {
      reports = reports.filter((report) => report.paidBy === filterPayer);
    }

    // ソート
    if (sortConfig.key) {
      reports = [...reports].sort((a, b) => {
        let valA = '';
        let valB = '';

        if (sortConfig.key === 'name') {
          valA = a.paidBy || '';
          valB = b.paidBy || '';
        } else if (sortConfig.key === 'bureau') {
          // 立替者の局名を取得
          const userA = users.find((u) => u.name === a.paidBy);
          const userB = users.find((u) => u.name === b.paidBy);
          const bureauA = bureaus.find((bu) => bu.id === userA?.bureauID)?.name || '';
          const bureauB = bureaus.find((bu) => bu.id === userB?.bureauID)?.name || '';
          valA = bureauA;
          valB = bureauB;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return reports;
  }, [buyReportsData, filterPayer, sortConfig, users, bureaus]);

  // 合計金額の計算
  const totals = useMemo(() => {
    return processedBuyReports.reduce(
      (acc, report) => {
        if (!report.isSettled) {
          acc.unsettled += report.amount;
        }
        if (!report.isPacked) {
          acc.unsealed += report.amount;
        }
        return acc;
      },
      { unsettled: 0, unsealed: 0 },
    );
  }, [processedBuyReports]);

  // NOTE: 初回レンダリングだと値が取ってこれずundefinedになったのでuseEffectで取得している。
  useEffect(() => {
    if (processedBuyReports.length > 0) {
      setSealChecks(
        Object.fromEntries(
          processedBuyReports.map((report) => [report.id, report.isPacked ?? false]),
        ),
      );
      setSettlementChecks(
        Object.fromEntries(
          processedBuyReports.map((report) => [report.id, report.isSettled ?? false]),
        ),
      );
    }
  }, [processedBuyReports]);

  const updateSealCheck = (id: number) => {
    if (settlementChecks[id]) {
      return;
    }
    setSealChecks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const updateSettlementCheck = (id: number) => {
    if (settlementChecks[id]) {
      return;
    }
    setSettlementChecks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEdit = (report: BuyReportDetail) => {
    router.push({
      pathname: '/create_purchase_report',
      query: {
        from: 'purchase_report_list',
        id: report.id,
      },
    });
  };

  const formatDate = useCallback((date: string) => {
    const datetime = date.replace('T', ' ');
    return datetime.substring(5, datetime.length - 10).replace('-', '/');
  }, []);

  const formatAmount = useCallback((amount: number) => {
    return amount.toLocaleString();
  }, []);

  const download = async (url: string, fileName: string) => {
    const downloadPath = `${process.env.NEXT_PUBLIC_MINIO_ENDPONT}/finansu/${url}`;
    const response = await fetch(downloadPath);
    const blob = await response.blob();
    saveAs(blob, fileName);
  };

  const [buyReportId, setBuyReportId] = useState<number>(0);
  const { trigger, error: statusError } = usePutBuyReportStatusBuyReportId(buyReportId);

  const updateStatus = useCallback(async () => {
    if (!buyReportId) return;

    const putBuyReportStatusBuyReportIdBody: PutBuyReportStatusBuyReportIdBody = {
      isPacked: sealChecks[buyReportId],
      isSettled: settlementChecks[buyReportId],
    };

    try {
      await trigger(putBuyReportStatusBuyReportIdBody);
    } catch {
      console.error('Failed to update buy_reports:', statusError);
    }
  }, [buyReportId, sealChecks, settlementChecks, trigger, statusError]);

  useEffect(() => {
    updateStatus();
  }, [updateStatus]);

  const onSuccess = useCallback(() => {
    mutateBuyReportData();
  }, [mutateBuyReportData]);

  const downloadCSV = async () => {
    const url = `${process.env.CSR_API_URI}/buy_reports/csv/download?year=${selectedYear}`;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, `購入報告_${selectedYear}.csv`);
    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  };

  // 立替者一覧の取得（重複排除）
  const payers = useMemo(() => {
    const allPayers = (buyReportsData?.data ?? []).map((r) => r.paidBy).filter(Boolean);
    return Array.from(new Set(allPayers));
  }, [buyReportsData]);

  if (isYearPeriodsLoading || isBuyReportsLoading) return <Loading />;
  if (yearPeriodsError || buyReportsError) return router.push('/500');

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
                  setSelectedYear(Number(e.target.value));
                }}
              >
                {yearPeriods &&
                  yearPeriods.map((year) => {
                    return (
                      <option className='w-fit' value={year.year} key={year.year}>
                        {year.year}年度
                      </option>
                    );
                  })}
              </select>
              <Menu closeOnSelect={false}>
                <MenuButton as={Button} className='w-fit items-center' variant='outline'>
                  表示設定
                  <BsFilter className='ml-2' />
                </MenuButton>
                <Portal>
                  <MenuList zIndex={100} className='p-2'>
                    <Text fontWeight='bold' mb={2} px={3} fontSize='sm'>
                      並び替え
                    </Text>
                    <MenuItem
                      onClick={() => setSortConfig({ key: 'name', direction: 'asc' })}
                      className='text-sm'
                    >
                      氏名 (昇順) {sortConfig.key === 'name' && sortConfig.direction === 'asc' && '✓'}
                    </MenuItem>
                    <MenuItem
                      onClick={() => setSortConfig({ key: 'name', direction: 'desc' })}
                      className='text-sm'
                    >
                      氏名 (降順) {sortConfig.key === 'name' && sortConfig.direction === 'desc' && '✓'}
                    </MenuItem>
                    <MenuItem
                      onClick={() => setSortConfig({ key: 'bureau', direction: 'asc' })}
                      className='text-sm'
                    >
                      局名 (昇順) {sortConfig.key === 'bureau' && sortConfig.direction === 'asc' && '✓'}
                    </MenuItem>
                    <MenuItem
                      onClick={() => setSortConfig({ key: 'bureau', direction: 'desc' })}
                      className='text-sm'
                    >
                      局名 (降順) {sortConfig.key === 'bureau' && sortConfig.direction === 'desc' && '✓'}
                    </MenuItem>
                    <MenuDivider />
                    <div className='px-3 py-2'>
                      <Text fontWeight='bold' mb={2} fontSize='sm'>
                        立替者で絞り込み
                      </Text>
                      <Select
                        size='sm'
                        value={filterPayer}
                        onChange={(e) => setFilterPayer(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value=''>全員</option>
                        {payers.map((payer) => (
                          <option key={payer} value={payer}>
                            {payer}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </MenuList>
                </Portal>
              </Menu>
              <PrimaryButton className='w-fit items-center' onClick={downloadCSV}>
                CSVダウンロード
                <TbDownload className='ml-2' size={20} />
              </PrimaryButton>
            </div>
            {/* 合計金額表示エリア */}
            <div className='mt-4 flex flex-col gap-4 rounded-md bg-gray-50 p-4 md:flex-row md:gap-8'>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>未精算金額合計</span>
                <span className='text-xl font-bold text-red-500'>
                  {totals.unsettled.toLocaleString()}円
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>未封詰め金額合計</span>
                <span className='text-xl font-bold text-red-500'>
                  {totals.unsealed.toLocaleString()}円
                </span>
              </div>
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
                  {processedBuyReports && processedBuyReports.length > 0 ? (
                    processedBuyReports.map((report) => (
                      <tr key={report.id}>
                        <td className='whitespace-nowrap px-4 py-3 text-center text-sm text-black-600'>
                          {formatDate(report.reportDate ?? '')}
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
                          {formatAmount(report.amount ?? 0)}
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <Checkbox
                            className='accent-primary-5'
                            checked={sealChecks[report.id ?? 0] || false}
                            onChange={() => {
                              setBuyReportId(report.id ?? 0);
                              updateSealCheck(report.id ?? 0);
                            }}
                          />
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <OpenCheckSettlementModalButton
                            id={report.id ?? 0}
                            isChecked={settlementChecks[report.id ?? 0]}
                            onConfirm={(id) => {
                              setBuyReportId(id);
                              updateSettlementCheck(id);
                            }}
                            disabled={!sealChecks[report.id ?? 0]}
                          />
                        </td>
                        <td>
                          <div className='flex'>
                            <div className='mx-1'>
                              <DownloadButton
                                tooltip='レシートダウンロード'
                                onClick={() => download(report.filePath, report.fileName ?? '')}
                              />
                            </div>
                            <div className='mx-1'>
                              <EditButton
                                isDisabled={
                                  sealChecks[report.id ?? 0] && settlementChecks[report.id ?? 0]
                                }
                                onClick={() => handleEdit(report)}
                              />
                            </div>
                            <div className='mx-1'>
                              <OpenDeleteModalButton
                                id={report.id ?? 0}
                                isDisabled={
                                  sealChecks[report.id ?? 0] && settlementChecks[report.id ?? 0]
                                }
                                onDeleteSuccess={() => onSuccess()}
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
