import { NextRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useGetDivisionsUsers, useGetFestivalItemsUsers } from '@/generated/hooks';
import { usePostBuyReports, usePutBuyReportsId } from '@/generated/hooks';
import { DivisionOption } from '@/generated/model';
import type { BuyReport, PostBuyReportsBody, PutBuyReportsIdBody } from '@/generated/model';
import { userAtom } from '@/store/atoms';

export const usePurchaseReportForm = (router: NextRouter) => {
  // URLパラメータの取得
  const {
    from,
    reportId,
    festivalItemID,
    paidBy,
    amount,
    divisionId: divisionIdQuery,
    itemName,
    divisionName,
  } = router.query;

  const isEditMode = from === 'purchase_report_list';

  const user = useRecoilValue(userAtom);
  const [departments, setDepartments] = useState<DivisionOption[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [festivalItems, setFestivalItems] = useState<any[]>([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState<number>(0);
  const [festivalItemName, setFestivalItemName] = useState<string>('');

  // 新規作成時の初期値
  const [purchaseReport, setPurchaseReport] = useState<BuyReport>({
    festivalItemID: 0,
    amount: 0,
    paidBy: '',
  });

  useEffect(() => {
    if (router.isReady && isEditMode) {
      setPurchaseReport({
        id: Number(reportId) || undefined,
        festivalItemID: Number(festivalItemID) || 0,
        amount: Number(amount) || 0,
        paidBy: (paidBy as string) || '',
      });
      if (itemName) {
        setFestivalItemName(itemName as string);
      }
      if (divisionIdQuery) {
        setSelectedDivisionId(Number(divisionIdQuery));
      }
    }
  }, [
    router.isReady,
    isEditMode,
    reportId,
    festivalItemID,
    amount,
    paidBy,
    itemName,
    divisionIdQuery,
  ]);


  const useDataFetching = () => {
    const year = new Date().getFullYear();
    const userId = user?.id || 0;
    const { data: divisionsData } = useGetDivisionsUsers(
      { year, user_id: userId },
      { swr: { enabled: !!userId && !!year && !isEditMode } },
    );

    const { data: festivalItemsData } = useGetFestivalItemsUsers(
      { year, division_id: selectedDivisionId },
      { swr: { enabled: !!selectedDivisionId && !!year && !isEditMode } },
    );

    return { divisionsData, festivalItemsData };
  };

  const { divisionsData, festivalItemsData } = useDataFetching();

  // 部門データの設定（新規作成時のみ）
  useEffect(() => {
    if (!isEditMode && divisionsData && divisionsData.data) {
      const mappedDivisions: DivisionOption[] = divisionsData.data.map((div) => ({
        divisionId: div.divisionId,
        name: div.name,
      }));
      setDepartments(mappedDivisions);
    }
  }, [divisionsData, isEditMode]);

  // 物品データの設定（新規作成時のみ）
  useEffect(() => {
    if (!isEditMode && festivalItemsData && festivalItemsData.data) {
      setFestivalItems(festivalItemsData.data);
    }
  }, [festivalItemsData, isEditMode]);

  // 購入報告の作成（新規作成時）
  const { trigger: submitBuyReport, isMutating: isSubmitting } = usePostBuyReports();

  // 購入報告の更新（編集時）
  const { trigger: updateBuyReport, isMutating: isUpdating } = usePutBuyReportsId(Number(reportId));

  const isProcessingUpdate = isUpdating && isEditMode;
  const isProcessingCreate = isSubmitting && !isEditMode;
  const isProcessing = isProcessingUpdate || isProcessingCreate;

  // 新規作成処理
  const handleCreate = async () => {
    if (!uploadedFile) {
      alert('レシート画像を選択してください');
      return;
    }

    const requestData: PostBuyReportsBody = {
      buy_report: purchaseReport,
      file: uploadedFile,
    };

    try {
      const response = await submitBuyReport(requestData);
      if (response) {
        alert('購入報告を登録しました');
        router.push('/my_page');
      }
    } catch (error) {
      handleError(error);
    }
  };

  // 更新処理
  const handleUpdate = async () => {
    if (!purchaseReport.id) {
      alert('更新対象のIDがありません');
      return;
    }

    const updateData: PutBuyReportsIdBody = {
      buy_report: {
        id: purchaseReport.id,
        festivalItemID: purchaseReport.festivalItemID,
        amount: purchaseReport.amount,
        paidBy: purchaseReport.paidBy,
      },
      ...(uploadedFile && { file: uploadedFile }),
    };

    try {
      const response = await updateBuyReport(updateData);
      if (response) {
        alert('購入報告を更新しました');
        router.push('/purchase_report_list');
      }
    } catch (error) {
      handleError(error);
    }
  };

  // エラーハンドリング
  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    alert(`購入報告の処理に失敗しました。${errorMessage}`);
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
    selectedDivisionId,
    setSelectedDivisionId,
    handleSubmit,
    isProcessing,
    festivalItemName,
    divisionName: divisionName as string,
  };
};
