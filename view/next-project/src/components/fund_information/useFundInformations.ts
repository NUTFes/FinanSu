import { useRouter } from 'next/router';
import { useState, useMemo, useCallback } from 'react';
import {
  useGetIncomeExpenditureManagements,
  useGetIncomes,
  usePostIncomes,
  useGetIncomesId,
  putIncomesId,
  deleteIncomesId,
  putIncomeExpenditureManagementsCheckId,
  useGetYears,
} from '@/generated/hooks';
import { Income } from '@/generated/model/income';
import { IncomeCategory } from '@/generated/model/incomeCategory';
import { IncomeExpenditureManagement } from '@/generated/model/incomeExpenditureManagement';
import { IncomeReceiveOption } from '@/generated/model/incomeReceiveOption';

export type FundInformationFormData = {
  amount: number;
  sponsorName?: string;
  incomeType: string;
  receiveOption?: keyof typeof IncomeReceiveOption;
};

// 年度IDの取得 とりあえず
function useCurrentYearId() {
  const { data: yearData } = useGetYears();

  return useMemo(() => {
    if (!yearData?.data || yearData.data.length === 0) {
      return null;
    }

    // YearPeriods型だとid取れなそう？
    type YearData = { id: number; year: number; createdAt: string; updatedAt: string };

    const sortedYears = [...yearData.data]
      .sort((a, b) => b.year - a.year)
      .map((year) => year as unknown as YearData);

    if (!sortedYears.length || !sortedYears[0].id) {
      return null;
    }

    const latestYearData = sortedYears[0];
    return latestYearData.id;
  }, [yearData]);
}

export function useFundInformations(id?: number) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 収支管理データの取得
  const {
    data: managementsData,
    isLoading: isLoadingManagements,
    error: managementsError,
    mutate: refreshManagements,
  } = useGetIncomeExpenditureManagements();

  // 収入カテゴリーの取得
  const {
    data: incomeCategoriesData,
    isLoading: isLoadingIncomeCategories,
    error: incomeCategoriesError,
  } = useGetIncomes();

  // 年度一覧の取得
  const { isLoading: isLoadingYears, error: yearsError } = useGetYears();

  const currentYearId = useCurrentYearId();

  // IDが指定されている場合、特定の収入データを取得
  const {
    data: incomeData,
    isLoading: isLoadingIncomeData,
    error: incomeDataError,
  } = useGetIncomesId(id || 0, {
    swr: { enabled: !!id },
  });

  // 収入作成のmutation
  const { trigger: createIncome, isMutating: isCreatingIncome } = usePostIncomes();

  // エラー処理の集約
  const isLoading =
    isLoadingManagements ||
    isLoadingIncomeCategories ||
    isLoadingYears ||
    isLoadingIncomeData ||
    isCreatingIncome ||
    isProcessing;

  const apiError = managementsError || incomeCategoriesError || yearsError || incomeDataError;
  if (apiError && !error) {
    setError('データの読み込みに失敗しました。再読み込みしてください。');
    console.error('API error:', apiError);
  }

  // 収支管理データの整形
  const fundInformations: IncomeExpenditureManagement[] = useMemo(() => {
    return managementsData?.data?.incomeExpenditureManagements || [];
  }, [managementsData]);

  // 合計残高の計算
  const totalBalance = useMemo(() => {
    return managementsData?.data?.total || 0;
  }, [managementsData]);

  // 収入カテゴリーの整形
  const incomeCategories: IncomeCategory[] = useMemo(() => {
    return incomeCategoriesData?.data || [];
  }, [incomeCategoriesData]);

  // 収入カテゴリーの名前とIDのマッピング
  const incomeTypeIdMap = useMemo(() => {
    return incomeCategories.reduce((acc, income) => {
      if (income.name && income.id) {
        acc[income.name] = income.id;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [incomeCategories]);

  // 現在編集中の収入データ
  const currentIncome = useMemo(() => {
    return incomeData?.data;
  }, [incomeData]);

  // 編集ページへの遷移
  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/fund_informations/${id}/edit`);
    },
    [router],
  );

  // 削除処理
  const handleDelete = useCallback(
    async (id: number) => {
      try {
        setIsProcessing(true);
        await deleteIncomesId(id);
        await refreshManagements();
        setError(null);
      } catch (err) {
        console.error('Failed to delete item:', err);
        setError('項目の削除に失敗しました。');
      } finally {
        setIsProcessing(false);
      }
    },
    [refreshManagements],
  );

  // チェック状態の更新
  const handleCheckChange = useCallback(
    async (id: number, checked: boolean): Promise<void> => {
      try {
        setIsProcessing(true);
        await putIncomeExpenditureManagementsCheckId(id, { isChecked: checked });
        await refreshManagements();
        setError(null);
      } catch (err) {
        console.error('Failed to update check status:', err);
        setError('確認状態の更新に失敗しました。');
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [refreshManagements],
  );

  // 新規作成
  const createFundInformation = useCallback(
    async (formData: FundInformationFormData): Promise<void> => {
      try {
        setIsProcessing(true);

        if (currentYearId === null) {
          setError('年度情報が取得できません。');
          return;
        }

        const selectedIncomeId = incomeTypeIdMap[formData.incomeType];
        if (selectedIncomeId === undefined) {
          setError('選択した収入種別が見つかりません');
          return;
        }

        // 企業協賛金の場合のみ、企業名が必須
        const isCompanySponsor = formData.incomeType === '企業協賛金';
        if (isCompanySponsor && !formData.sponsorName) {
          setError('企業協賛金の場合は企業名を入力してください');
          return;
        }

        const sponsorName = isCompanySponsor ? formData.sponsorName : undefined;

        const incomeData: Income = {
          incomeId: selectedIncomeId,
          amount: formData.amount,
          sponsorName: sponsorName,
          yearId: currentYearId,
          receiveOption: formData.receiveOption as IncomeReceiveOption,
        };

        await createIncome(incomeData);
        await refreshManagements();
        setError(null);
        router.push('/fund_informations');
      } catch (err) {
        console.error('Failed to create fund information:', err);
        setError('収入報告の作成に失敗しました。');
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [createIncome, incomeTypeIdMap, refreshManagements, router, currentYearId],
  );

  // 更新処理
  const updateFundInformation = useCallback(
    async (incomeData: Income): Promise<void> => {
      if (!id) {
        setError('更新対象のIDが指定されていません');
        return;
      }

      // 年度IDのチェック（更新時にも年度IDが必要な場合）
      if (incomeData.yearId === null || incomeData.yearId === undefined) {
        if (currentYearId === null) {
          setError('年度情報が取得できません。管理者に連絡してください。');
          return;
        }
        // 年度IDが指定されていない場合は現在の年度IDを使用
        incomeData.yearId = currentYearId;
      }

      try {
        setIsProcessing(true);
        await putIncomesId(id, incomeData);
        await refreshManagements();
        setError(null);
        router.push('/fund_informations');
      } catch (err) {
        console.error('Failed to update fund information:', err);
        setError('収入報告の更新に失敗しました。');
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [id, refreshManagements, router, currentYearId],
  );

  return {
    fundInformations,
    incomeCategories,
    incomeTypeIdMap,
    currentIncome,
    isLoading,
    error,
    totalBalance,
    handleEdit,
    handleDelete,
    handleCheckChange,
    createFundInformation,
    updateFundInformation,
    currentYearId,
  };
}
