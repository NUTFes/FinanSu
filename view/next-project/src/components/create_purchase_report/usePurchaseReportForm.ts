import { NextRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import {
  useGetDivisionsUsers,
  useGetFestivalItemsUsers,
  useGetBuyReportsId,
  usePostBuyReports,
  usePutBuyReportsId,
} from '@/generated/hooks';
import { DivisionOption, FestivalItemOption } from '@/generated/model';
import { userAtom } from '@/store/atoms';

import type { BuyReport, PostBuyReportsBody, PutBuyReportsIdBody } from '@/generated/model';

const API_ERROR_MESSAGES = {
  MISSING_ID: '更新対象のIDがありません',
  MISSING_FILE: 'レシート画像を選択してください',
  CREATE_SUCCESS: '購入報告を登録しました',
  UPDATE_SUCCESS: '購入報告を更新しました',
  GENERIC_ERROR: '不明なエラーが発生しました',
};

const useReportFormData = (
  userId: number,
  year: number,
  activeDivisionId: number,
  isEditMode: boolean,
) => {
  // 部門データの取得（新規作成時のみ）
  const { data: divisionsData } = useGetDivisionsUsers(
    { year, user_id: userId },
    { swr: { enabled: !!userId && !!year && !isEditMode } },
  );

  // 編集モード時に物品一覧を取得
  const { data: festivalItemsData } = useGetFestivalItemsUsers(
    { year, division_id: activeDivisionId },
    { swr: { enabled: !!activeDivisionId && !!year } },
  );

  return { divisionsData, festivalItemsData };
};

export const usePurchaseReportForm = (router: NextRouter) => {
  // URLパラメータの取得
  const { from, id: reportIdParam } = router.query;
  const reportId = reportIdParam ? Number(reportIdParam) : undefined;
  const isEditMode = from === 'purchase_report_list';

  const user = useRecoilValue(userAtom);
  const [departments, setDepartments] = useState<DivisionOption[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [festivalItems, setFestivalItems] = useState<FestivalItemOption[]>([]);
  const [activeDivisionId, setActiveDivisionId] = useState<number>(0);
  const [festivalItemName, setFestivalItemName] = useState<string>('');
  const [divisionName, setDivisionName] = useState<string>('');

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
        enabled: isEditMode && !!reportId,
      },
    },
  );

  const { divisionsData, festivalItemsData } = useReportFormData(
    userId,
    year,
    activeDivisionId,
    isEditMode,
  );

  // 編集モードでデータ取得後の処理
  useEffect(() => {
    if (isEditMode && buyReportData && buyReportData.data) {
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
        setActiveDivisionId(buyReportWithDiv.divisionId);
      }
    }
  }, [buyReportData, isEditMode]);

  // 部門データの設定（新規作成時のみ）
  useEffect(() => {
    if (!isEditMode && divisionsData && divisionsData.data) {
      const mappedDivisions: DivisionOption[] = divisionsData.data.map((division) => ({
        divisionId: division.divisionId,
        name: division.name,
      }));
      setDepartments(mappedDivisions);
    }
  }, [divisionsData, isEditMode]);

  // 物品データの設定（新規作成時のみ）
  const findFestivalItemName = (items: FestivalItemOption[], itemId: number): string => {
    const selectedItem = items.find((item) => item.festivalItemId === itemId);
    return selectedItem?.name || '';
  };

  // 物品データの設定
  useEffect(() => {
    if (festivalItemsData && festivalItemsData.data) {
      setFestivalItems(festivalItemsData.data);

      // 編集モード時には選択されている物品の名前を取得
      if (isEditMode && purchaseReport.festivalItemID) {
        setFestivalItemName(
          findFestivalItemName(festivalItemsData.data, purchaseReport.festivalItemID),
        );
      }

      // 部門名を取得
      if (isEditMode && activeDivisionId && festivalItemsData.data.length > 0) {
        const divisionInfo = festivalItemsData.data[0] as FestivalItemOption & {
          divisionName?: string;
        };
        if (divisionInfo.divisionName) {
          setDivisionName(divisionInfo.divisionName);
        }
      }
    }
  }, [festivalItemsData, isEditMode, purchaseReport.festivalItemID, activeDivisionId]);

  // 購入報告の作成（新規作成時）
  const { trigger: submitBuyReport, isMutating: isSubmitting } = usePostBuyReports();

  // 購入報告の更新（編集時）
  const { trigger: updateBuyReport, isMutating: isUpdating } = usePutBuyReportsId(reportId || 0);

  const isProcessingUpdate = isUpdating && isEditMode;
  const isProcessingCreate = isSubmitting && !isEditMode;
  const isProcessing = isProcessingUpdate || isProcessingCreate || isReportDataLoading;

  // エラーハンドリング
  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : API_ERROR_MESSAGES.GENERIC_ERROR;
    alert(`購入報告の処理に失敗しました。${errorMessage}`);
  };

  // 新規作成処理
  const handleCreate = async () => {
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
  };

  // 更新処理
  const handleUpdate = async () => {
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
  };

  // 金額入力処理
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const numValue = value === '' ? 0 : Number(value);
    const limitedValue = Math.min(numValue, 999999999);
    setPurchaseReport((prev) => ({ ...prev, amount: limitedValue }));
  };

  // 部門選択処理
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value) || 0;
    setActiveDivisionId(selectedId);
    setPurchaseReport((prev) => ({ ...prev, festivalItemID: 0 }));
  };

  // 物品選択処理
  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value) || 0;
    setPurchaseReport((prev) => ({ ...prev, festivalItemID: selectedId }));
  };

  // 購入報告の送信処理
  const handleSubmit = async () => {
    if (isEditMode) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  return {
    isEditMode,
    purchaseReport,
    setPurchaseReport,
    uploadedFile,
    setUploadedFile,
    departments,
    festivalItems,
    activeDivisionId,
    setActiveDivisionId,
    handleSubmit,
    isProcessing,
    festivalItemName,
    divisionName,
    isReportDataLoading,
    handleAmountChange,
    handleDivisionChange,
    handleItemChange,
  };
};
