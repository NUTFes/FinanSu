import { saveAs } from 'file-saver';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { TbDownload } from 'react-icons/tb';

import DownloadButton from '@/components/common/DownloadButton';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';
import { OpenCheckSettlementModalButton } from '@/components/purchasereports';
import PurchaseReportPaidByFilterModal from '@/components/purchasereports/PurchaseReportPaidByFilterModal';
import PurchaseReportSummaryAmounts from '@/components/purchasereports/PurchaseReportSummaryAmounts';
import { BUREAUS } from '@/constants/bureaus';
import {
  useGetBuyReportsDetails,
  useGetBuyReportsSummary,
  useGetUsers,
  useGetYearsPeriods,
  usePutBuyReportStatusBuyReportId,
} from '@/generated/hooks';
import { useCurrentUser } from '@/store';
import { buildPaidByFilterParams } from '@/utils/purchaseReportFilters';
import { Card, Checkbox, EditButton, Loading, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import OpenDeleteModalButton from '@components/purchasereports/OpenDeleteModalButton';

import type {
  BuyReportDetail,
  GetBuyReportsDetailsParams,
  GetBuyReportsSummaryParams,
  PutBuyReportStatusBuyReportIdBody,
} from '@/generated/model';

export default function PurchaseReports() {
  const router = useRouter();
  const {
    data: yearPeriodsData,
    isLoading: isYearPeriodsLoading,
    error: yearPeriodsError,
  } = useGetYearsPeriods();
  const yearPeriods = yearPeriodsData?.data;

  const user = useCurrentUser();

  useEffect(() => {
    if (user?.roleID === 1) {
      router.push('/my_page');
    }
  }, [router, user?.roleID]);

  const [selectedYear, setSelectedYear] = useState<number>(0);

  useEffect(() => {
    if (yearPeriods && yearPeriods.length > 0) {
      const latestYear = Math.max(...yearPeriods.map((period) => period.year));
      setSelectedYear(latestYear);
    }
  }, [yearPeriods]);

  const [isPaidByFilterOpen, setIsPaidByFilterOpen] = useState(false);
  const [selectedBureauId, setSelectedBureauId] = useState<number | null>(null);
  const [selectedPaidBy, setSelectedPaidBy] = useState<string | null>(null);
  const [selectedPaidByUserId, setSelectedPaidByUserId] = useState<number | null>(null);

  const paidByFilterParams = buildPaidByFilterParams({
    paidByUserId: selectedPaidByUserId,
    paidBy: selectedPaidBy,
  });

  const getBuyReportsDetailsParams: GetBuyReportsDetailsParams = {
    year: selectedYear,
    ...paidByFilterParams,
  };

  const {
    data: buyReportsData,
    isLoading: isBuyReportsLoading,
    error: buyReportsError,
    mutate: mutateBuyReportData,
  } = useGetBuyReportsDetails(getBuyReportsDetailsParams, {
    swr: { enabled: selectedYear > 0 },
  });

  const buyReports = useMemo(() => buyReportsData?.data ?? [], [buyReportsData]);

  const { data: allYearBuyReportsData, isLoading: isAllYearLoading } = useGetBuyReportsDetails(
    { year: selectedYear },
    { swr: { enabled: selectedYear > 0 } },
  );
  const allYearBuyReports = useMemo(
    () => allYearBuyReportsData?.data ?? [],
    [allYearBuyReportsData],
  );

  const modalPaidByUserIds = useMemo(
    () => [
      ...new Set(
        allYearBuyReports.flatMap((r) => (r.paidByUserId != null ? [r.paidByUserId] : [])),
      ),
    ],
    [allYearBuyReports],
  );

  const { data: modalUsersResponse } = useGetUsers(
    modalPaidByUserIds.length > 0 ? { ids: modalPaidByUserIds } : undefined,
    { swr: { enabled: selectedYear > 0 && modalPaidByUserIds.length > 0 } },
  );
  const modalUsers = modalUsersResponse?.data ?? [];

  const userBureauMap = useMemo(
    () => Object.fromEntries(modalUsers.map((u) => [u.id, u.bureauID])),
    [modalUsers],
  );

  const isBureauOnlyFilter =
    selectedBureauId != null && selectedPaidByUserId == null && selectedPaidBy == null;

  const displayedBuyReports = useMemo(() => {
    if (!isBureauOnlyFilter) return buyReports;
    return allYearBuyReports.filter((r) => {
      if (r.paidByUserId != null) return userBureauMap[r.paidByUserId] === selectedBureauId;
      return modalUsers.some((u) => u.bureauID === selectedBureauId && u.name === r.paidBy);
    });
  }, [
    isBureauOnlyFilter,
    buyReports,
    allYearBuyReports,
    userBureauMap,
    selectedBureauId,
    modalUsers,
  ]);

  const paidByUserIds = useMemo(
    () => [
      ...new Set(
        displayedBuyReports.flatMap((r) => (r.paidByUserId != null ? [r.paidByUserId] : [])),
      ),
    ],
    [displayedBuyReports],
  );

  const { data: usersResponse } = useGetUsers(
    paidByUserIds.length > 0 ? { ids: paidByUserIds } : undefined,
    { swr: { enabled: selectedYear > 0 && paidByUserIds.length > 0 } },
  );
  const users = usersResponse?.data ?? [];

  const userNameMap = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u.name])), [users]);

  const modalLegacyPaidByOptions = useMemo(() => {
    const userNames = new Set(modalUsers.map((u) => u.name));
    const seen = new Set<string>();
    return allYearBuyReports
      .map((r) => r.paidBy)
      .filter((name): name is string => {
        if (!name || userNames.has(name) || seen.has(name)) return false;
        seen.add(name);
        return true;
      });
  }, [allYearBuyReports, modalUsers]);

  const getBuyReportsSummaryParams: GetBuyReportsSummaryParams = {
    year: selectedYear,
    ...paidByFilterParams,
  };

  const {
    data: buyReportsSummaryData,
    isLoading: isBuyReportsSummaryLoading,
    error: buyReportsSummaryError,
    mutate: mutateBuyReportsSummary,
  } = useGetBuyReportsSummary(getBuyReportsSummaryParams, {
    swr: { enabled: selectedYear > 0 },
  });

  const [sealChecks, setSealChecks] = useState<Record<number, boolean>>({});
  const [settlementChecks, setSettlementChecks] = useState<Record<number, boolean>>({});

  // NOTE: 初回レンダリングだと値が取ってこれずundefinedになったのでuseEffectで取得している。
  useEffect(() => {
    if (displayedBuyReports.length > 0) {
      setSealChecks(
        Object.fromEntries(
          displayedBuyReports.map((report) => [report.id, report.isPacked ?? false]),
        ),
      );
      setSettlementChecks(
        Object.fromEntries(
          displayedBuyReports.map((report) => [report.id, report.isSettled ?? false]),
        ),
      );
    }
  }, [displayedBuyReports]);

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

  const buyReportsSummary = buyReportsSummaryData?.data;

  const summaryUnsettledAmount = isBureauOnlyFilter
    ? formatAmount(
        displayedBuyReports.filter((r) => !r.isSettled).reduce((s, r) => s + (r.amount ?? 0), 0),
      )
    : isBuyReportsSummaryLoading || buyReportsSummaryError || buyReportsSummary == null
      ? '-'
      : formatAmount(buyReportsSummary.unsettledAmount ?? 0);

  const summaryUnpackedAmount = isBureauOnlyFilter
    ? formatAmount(
        displayedBuyReports.filter((r) => !r.isPacked).reduce((s, r) => s + (r.amount ?? 0), 0),
      )
    : isBuyReportsSummaryLoading || buyReportsSummaryError || buyReportsSummary == null
      ? '-'
      : formatAmount(buyReportsSummary.unpackedAmount ?? 0);

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
      mutateBuyReportData();
      mutateBuyReportsSummary();
    } catch (e) {
      console.error('Failed to update buy_reports:', e, statusError);
    }
  }, [
    buyReportId,
    sealChecks,
    settlementChecks,
    trigger,
    statusError,
    mutateBuyReportData,
    mutateBuyReportsSummary,
  ]);

  useEffect(() => {
    updateStatus();
  }, [updateStatus]);

  const onSuccess = useCallback(() => {
    mutateBuyReportData();
    mutateBuyReportsSummary();
  }, [mutateBuyReportData, mutateBuyReportsSummary]);

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

  if (isYearPeriodsLoading || isBuyReportsLoading || (isBureauOnlyFilter && isAllYearLoading))
    return <Loading />;
  if (yearPeriodsError || buyReportsError) return router.push('/500');

  return (
    <MainLayout>
      <div className='flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4'>
        <Card w='flex flex-col w-full md:w-fit'>
          <div className='mx-4 mt-8 md:mx-8 md:mt-16'>
            <div className='flex flex-col items-center gap-6 md:flex-row'>
              <Title title={'購入報告一覧'} />
              <select
                className='border-black-0 border-b'
                value={selectedYear || ''}
                onChange={async (e) => {
                  setSelectedYear(Number(e.target.value));
                }}
              >
                <option value='' disabled />
                {yearPeriods &&
                  yearPeriods.map((year) => {
                    return (
                      <option className='w-fit' value={year.year} key={year.year}>
                        {year.year}年度
                      </option>
                    );
                  })}
              </select>
              <PrimaryButton className='w-fit items-center' onClick={downloadCSV}>
                CSVダウンロード
                <TbDownload className='ml-2' size={20} />
              </PrimaryButton>
              <PurchaseReportSummaryAmounts
                unsettledAmountText={summaryUnsettledAmount}
                unpackedAmountText={summaryUnpackedAmount}
              />
            </div>
          </div>

          {isPaidByFilterOpen && (
            <PurchaseReportPaidByFilterModal
              onClose={() => setIsPaidByFilterOpen(false)}
              onApply={({ bureauId, paidByUserId, paidBy }) => {
                setSelectedBureauId(bureauId);
                setSelectedPaidByUserId(paidByUserId ?? null);
                setSelectedPaidBy(paidBy);
                setIsPaidByFilterOpen(false);
              }}
              bureaus={BUREAUS}
              users={modalUsers}
              legacyPaidByOptions={modalLegacyPaidByOptions}
              selectedBureauId={selectedBureauId}
              selectedPaidByUserId={selectedPaidByUserId}
              selectedPaidBy={selectedPaidBy}
            />
          )}

          <div className='mt-2 flex-1 overflow-auto p-4 md:p-8'>
            <div className='min-w-max'>
              <table className='mb-5 table-auto border-collapse'>
                <thead>
                  <tr className='border-b-primary-1 border-b py-3'>
                    <th className='text-black-600 px-4 pb-2 text-sm font-normal whitespace-nowrap'>
                      日付
                    </th>
                    <th className='text-black-600 px-4 pb-2 text-sm font-normal whitespace-nowrap'>
                      局名
                    </th>
                    <th className='text-black-600 px-4 pb-2 text-sm font-normal whitespace-nowrap'>
                      部門
                    </th>
                    <th className='text-black-600 px-4 pb-2 text-sm font-normal whitespace-nowrap'>
                      物品
                    </th>
                    <th className='text-black-600 px-4 pb-2 text-sm font-normal whitespace-nowrap'>
                      <div className='flex items-center justify-center gap-1'>
                        <span>立替者</span>
                        <button
                          type='button'
                          className='text-black-600 hover:bg-white-100 rounded-full p-0.5'
                          onClick={() => setIsPaidByFilterOpen(true)}
                          aria-label='立替者の絞り込み'
                        >
                          <RiArrowDropDownLine size={20} />
                        </button>
                      </div>
                    </th>
                    <th className='text-black-600 px-4 pb-2 text-sm font-normal whitespace-nowrap'>
                      金額
                    </th>
                    <th className='text-black-600 px-4 pb-2 text-sm font-normal whitespace-nowrap'>
                      封詰め
                    </th>
                    <th className='text-black-600 px-4 pb-2 text-sm font-normal whitespace-nowrap'>
                      清算完了
                    </th>
                    <th className='text-black-600 px-4 pb-2 text-sm whitespace-nowrap'></th>
                  </tr>
                </thead>

                <tbody>
                  {displayedBuyReports && displayedBuyReports.length > 0 ? (
                    displayedBuyReports.map((report) => (
                      <tr key={report.id}>
                        <td className='text-black-600 px-4 py-3 text-center text-sm whitespace-nowrap'>
                          {formatDate(report.reportDate ?? '')}
                        </td>
                        <td className='text-black-600 px-4 py-3 text-center text-sm whitespace-nowrap'>
                          {report.financialRecordName}
                        </td>
                        <td className='text-black-600 px-4 py-3 text-center text-sm whitespace-nowrap'>
                          {report.divisionName}
                        </td>
                        <td className='text-black-600 px-4 py-3 text-center text-sm whitespace-nowrap'>
                          {report.festivalItemName}
                        </td>
                        <td className='text-black-600 px-4 py-3 text-center text-sm whitespace-nowrap'>
                          {(report.paidByUserId ? userNameMap[report.paidByUserId] : undefined) ??
                            report.paidBy ??
                            '-'}
                        </td>
                        <td className='text-black-600 px-4 py-3 text-center text-sm whitespace-nowrap'>
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
                      <td className='border-primary-1 border-b px-1 py-3' colSpan={9}>
                        <div className='text-black-600 text-center text-sm'>データがありません</div>
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
