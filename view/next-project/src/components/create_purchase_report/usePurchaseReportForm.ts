import { NextRouter } from 'next/router';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import {
  useGetDivisionsUsers,
  useGetFestivalItemsUsers,
  useGetBuyReportsId,
  usePostBuyReports,
  usePutBuyReportsId,
  useGetDivisionsYears,
} from '@/generated/hooks';
import { DivisionOption, FestivalItemOption } from '@/generated/model';
import type { BuyReport, PostBuyReportsBody, PutBuyReportsIdBody } from '@/generated/model';
import { userAtom } from '@/store/atoms';

const API_ERROR_MESSAGES = {
  MISSING_ID: '更新対象のIDがありません',
  MISSING_FILE: 'レシート画像を選択してください',
  CREATE_SUCCESS: '購入報告を登録しました',
  UPDATE_SUCCESS: '購入報告を更新しました',
  GENERIC_ERROR: '不明なエラーが発生しました',
} as const;

interface FormState {
  activeDivisionId: number;
  festivalItemName: string;
  divisionName: string;
}

const useReportFormData = (
  userId: number,
  year: number,
  activeDivisionId: number,
  isEditMode: boolean,
) => {
  const shouldFetchDivisions = !!(userId && year && !isEditMode);
  const shouldFetchItems = !!(activeDivisionId && year);
  const shouldFetchDivisionsYears = !!(year && isEditMode && activeDivisionId);

  const { data: divisionsData } = useGetDivisionsUsers(
    { year, user_id: userId },
    { swr: { enabled: shouldFetchDivisions } },
  );

  const { data: festivalItemsData } = useGetFestivalItemsUsers(
    { year, division_id: activeDivisionId },
    { swr: { enabled: shouldFetchItems } },
  );

  const { data: divisionsYearsData } = useGetDivisionsYears(
    { year },
    { swr: { enabled: shouldFetchDivisionsYears } },
  );

  return { divisionsData, festivalItemsData, divisionsYearsData };
};

export const usePurchaseReportForm = (router: NextRouter) => {
  // URLパラメータの取得
  const { reportId, isEditMode } = useMemo(() => {
    const { from, id: reportIdParam } = router.query;
    return {
      reportId: reportIdParam ? Number(reportIdParam) : undefined,
      isEditMode: from === 'purchase_report_list',
    };
  }, [router.query]);

  const user = useRecoilValue(userAtom);
  const [departments, setDepartments] = useState<DivisionOption[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [festivalItems, setFestivalItems] = useState<FestivalItemOption[]>([]);
  const [formState, setFormState] = useState<FormState>({
    activeDivisionId: 0,
    festivalItemName: '',
    divisionName: '',
  });

  // 新規作成時の初期値
  const [purchaseReport, setPurchaseReport] = useState<BuyReport>({
    festivalItemID: 0,
    amount: 0,
    paidBy: '',
  });

  const year = new Date().getFullYear();
  const userId = user?.id || 0;

  // 編集モードの場合、購入報告データを取得
  const { data: buyReportData, isLoading: isReportDataLoading } = useGetBuyReportsId(
    reportId || 0,
    {
      swr: {
        enabled: !!(isEditMode && reportId),
      },
    },
  );

  const { divisionsData, festivalItemsData, divisionsYearsData } = useReportFormData(
    userId,
    year,
    formState.activeDivisionId,
    isEditMode,
  );

  useEffect(() => {
    if (isEditMode && buyReportData?.data) {
      const buyReportWithDiv = buyReportData.data;

      // 購入報告データのセット
      setPurchaseReport({
        id: buyReportWithDiv.id,
        festivalItemID: buyReportWithDiv.festivalItemID || 0,
        amount: buyReportWithDiv.amount || 0,
        paidBy: buyReportWithDiv.paidBy || '',
      });

      // 部門IDのセット
      if (buyReportWithDiv.divisionId) {
        setFormState((prev) => ({
          ...prev,
          activeDivisionId: buyReportWithDiv.divisionId as number,
        }));
      }
    }
  }, [buyReportData, isEditMode]);

  // 部門名と物品名の取得
  useEffect(() => {
    if (isEditMode && formState.activeDivisionId && divisionsYearsData?.data) {
      const foundDivision = divisionsYearsData.data.find(
        (division) => division.divisionId === formState.activeDivisionId,
      );
      if (foundDivision) {
        setFormState((prev) => ({ ...prev, divisionName: foundDivision.name }));
      }
    }
  }, [isEditMode, formState.activeDivisionId, divisionsYearsData]);

  // 部門データの設定（新規作成時のみ）
  useEffect(() => {
    if (!isEditMode && divisionsData?.data) {
      const mappedDivisions: DivisionOption[] = divisionsData.data.map((division) => ({
        divisionId: division.divisionId,
        name: division.name,
      }));
      setDepartments(mappedDivisions);
    }
  }, [divisionsData, isEditMode]);

  // 物品データの設定（新規作成時のみ）
  const findFestivalItemName = useCallback(
    (items: FestivalItemOption[], itemId: number): string => {
      const selectedItem = items.find((item) => item.festivalItemId === itemId);
      return selectedItem?.name || '';
    },
    [],
  );

  // 物品データの設定
  useEffect(() => {
    if (festivalItemsData?.data) {
      setFestivalItems(festivalItemsData.data);

      // 編集モード時には選択されている物品の名前を取得
      if (isEditMode && purchaseReport.festivalItemID) {
        const itemName = findFestivalItemName(
          festivalItemsData.data,
          purchaseReport.festivalItemID,
        );
        setFormState((prev) => ({ ...prev, festivalItemName: itemName }));
      }
    }
  }, [festivalItemsData, isEditMode, purchaseReport.festivalItemID, findFestivalItemName]);

  // 購入報告の作成（新規作成時）
  const { trigger: submitBuyReport, isMutating: isSubmitting } = usePostBuyReports();

  // 購入報告の更新（編集時）
  const { trigger: updateBuyReport, isMutating: isUpdating } = usePutBuyReportsId(reportId || 0);

  const isProcessing = useMemo(() => {
    return (isUpdating && isEditMode) || (isSubmitting && !isEditMode) || isReportDataLoading;
  }, [isUpdating, isEditMode, isSubmitting, isReportDataLoading]);

  // データ読み込み状態
  const isDataLoading = useMemo(() => {
    if (isEditMode) {
      return isReportDataLoading || (!buyReportData && !!reportId);
    }
    return false;
  }, [isEditMode, isReportDataLoading, buyReportData, reportId]);

  // エラーハンドリング
  const handleError = useCallback((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : API_ERROR_MESSAGES.GENERIC_ERROR;
    alert(`購入報告の処理に失敗しました。${errorMessage}`);
  }, []);

  // 新規作成処理
  const handleCreate = useCallback(async () => {
    if (!uploadedFile) {
      alert(API_ERROR_MESSAGES.MISSING_FILE);
      return;
    }

    const requestData: PostBuyReportsBody = {
      buy_report: purchaseReport,
      file: uploadedFile,
    };

    try {
      const response = await submitBuyReport(requestData);
      if (response) {
        alert(API_ERROR_MESSAGES.CREATE_SUCCESS);
        router.push('/my_page');
      }
    } catch (error) {
      handleError(error);
    }
  }, [uploadedFile, purchaseReport, submitBuyReport, router, handleError]);

  // 更新処理
  const handleUpdate = useCallback(async () => {
    if (!reportId) {
      alert(API_ERROR_MESSAGES.MISSING_ID);
      return;
    }

    const updateData: PutBuyReportsIdBody = {
      buy_report: {
        id: reportId,
        festivalItemID: purchaseReport.festivalItemID,
        amount: purchaseReport.amount,
        paidBy: purchaseReport.paidBy,
      },
      ...(uploadedFile && { file: uploadedFile }),
    };

    try {
      const response = await updateBuyReport(updateData);
      if (response) {
        alert(API_ERROR_MESSAGES.UPDATE_SUCCESS);
        router.push('/purchase_report_list');
      }
    } catch (error) {
      handleError(error);
    }
  }, [reportId, purchaseReport, uploadedFile, updateBuyReport, router, handleError]);

  // 金額入力処理
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const numValue = value === '' ? 0 : Number(value);
    const limitedValue = Math.min(numValue, 999999999);
    setPurchaseReport((prev) => ({ ...prev, amount: limitedValue }));
  }, []);

  // 部門選択処理
  const handleDivisionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value) || 0;
    setFormState((prev) => ({ ...prev, activeDivisionId: selectedId }));
    setPurchaseReport((prev) => ({ ...prev, festivalItemID: 0 }));
  }, []);

  // 物品選択処理
  const handleItemChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value) || 0;
    setPurchaseReport((prev) => ({ ...prev, festivalItemID: selectedId }));
  }, []);

  // 購入報告の送信処理
  const handleSubmit = useCallback(async () => {
    if (isEditMode) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  }, [isEditMode, handleUpdate, handleCreate]);

  return {
    isEditMode,
    purchaseReport,
    setPurchaseReport,
    uploadedFile,
    setUploadedFile,
    departments,
    festivalItems,
    activeDivisionId: formState.activeDivisionId,
    setActiveDivisionId: (id: number) =>
      setFormState((prev) => ({ ...prev, activeDivisionId: id })),
    handleSubmit,
    isProcessing,
    isDataLoading,
    festivalItemName: formState.festivalItemName,
    divisionName: formState.divisionName,
    isReportDataLoading,
    handleAmountChange,
    handleDivisionChange,
    handleItemChange,
  };
};
