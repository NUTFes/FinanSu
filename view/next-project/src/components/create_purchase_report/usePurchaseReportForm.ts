import { NextRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useGetDivisionsUsers, useGetFestivalItemsUsers } from '@/generated/hooks';
import { usePostBuyReports, usePutBuyReportsId } from '@/generated/hooks';
import { DivisionOption } from '@/generated/model';
import type { BuyReport, PostBuyReportsBody } from '@/generated/model';
import { userAtom } from '@/store/atoms';
import { User } from '@/type/common';

export const usePurchaseReportForm = (router: NextRouter) => {
  const {
    from,
    reportId,
    festivalItemName,
    amount,
    paidBy,
    divisionId: divisionIdQuery,
  } = router.query;
  const isFromReport = from === 'purchase_report_list';

  const user = useRecoilValue(userAtom);
  const [currentUser, setCurrentUser] = useState<User>();
  const [departments, setDepartments] = useState<DivisionOption[]>([]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [festivalItems, setFestivalItems] = useState<any[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(0);

  // 初期値を編集時と新規作成で分離
  const getInitialBuyReport = (): BuyReport => {
    if (isFromReport) {
      return {
        id: Number(reportId) || undefined,
        festivalItemID: 0,
        amount: Number(amount) || 0,
        paidBy: (paidBy as string) || '',
      };
    }
    return {
      festivalItemID: 0,
      amount: 0,
      paidBy: '',
    };
  };

  const [buyReport, setBuyReport] = useState<BuyReport>(getInitialBuyReport());

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  // 部門のデータを取得
  const year = new Date().getFullYear();
  const userId = currentUser?.id || 0;
  const { data: divisionsData } = useGetDivisionsUsers(
    { year, user_id: userId },
    { swr: { enabled: !!userId && !!year } },
  );

  // 物品のデータを取得
  const { data: festivalItemsData } = useGetFestivalItemsUsers(
    {
      year,
      division_id: selectedDepartmentId,
    },
    {
      swr: {
        enabled: !!selectedDepartmentId && !!year,
      },
    },
  );

  // 部門データの設定
  useEffect(() => {
    if (divisionsData && divisionsData.data) {
      const mappedDivisions: DivisionOption[] = divisionsData.data.map((div) => ({
        divisionId: div.divisionId,
        name: div.name,
      }));
      setDepartments(mappedDivisions);

      // 編集時
      if (isFromReport && divisionIdQuery) {
        const divId = Number(divisionIdQuery);
        setSelectedDepartmentId(divId);
      }
    }
  }, [divisionsData, divisionIdQuery, isFromReport]);

  // 物品データの設定
  useEffect(() => {
    if (festivalItemsData && festivalItemsData.data) {
      setFestivalItems(festivalItemsData.data);

      if (isFromReport && festivalItemName && festivalItemsData.data.length > 0) {
        const item = festivalItemsData.data.find((item) => item.name === festivalItemName);
        if (item) {
          setBuyReport((prev) => ({
            ...prev,
            festivalItemID: item.festivalItemId,
          }));
        }
      }
    }
  }, [festivalItemsData, festivalItemName, isFromReport]);

  // 購入報告の作成
  const {
    trigger: submitBuyReport,
    isMutating: isSubmitting,
    error: submitError,
  } = usePostBuyReports();

  // 購入報告の更新
  const {
    trigger: updateBuyReport,
    isMutating: isUpdating,
    error: updateError,
  } = usePutBuyReportsId(Number(reportId));

  const handleSubmit = async () => {
    try {
      if (isFromReport && buyReport.id) {
        // 更新時
        const updateData = {
          buy_report: buyReport,
          file: receiptFile || undefined,
        };

        const response = await updateBuyReport(updateData);
        if (response) {
          alert('購入報告を更新しました');
          router.push('/purchase_report_list');
        }
      } else {
        // 新規登録時
        if (!receiptFile) {
          alert('レシート画像を選択してください');
          return;
        }

        const requestData: PostBuyReportsBody = {
          buy_report: buyReport,
          file: receiptFile,
        };

        const response = await submitBuyReport(requestData);

        if (response) {
          alert('購入報告を登録しました');
          router.push('/purchase_report_list');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      alert(`購入報告の処理に失敗しました。${errorMessage}`);
    }
  };

  // 処理中かどうか
  const isProcessing = isSubmitting || isUpdating;
  const errorMessage = submitError || updateError;

  return {
    isFromReport,
    buyReport,
    setBuyReport,
    receiptFile,
    setReceiptFile,
    departments,
    festivalItems,
    selectedDepartmentId,
    setSelectedDepartmentId,
    handleSubmit,
    isProcessing,
    errorMessage,
    festivalItemName,
  };
};
