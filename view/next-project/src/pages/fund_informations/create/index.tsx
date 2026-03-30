import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Title } from '@/components/common';
import { FundInformationForm } from '@/components/fund_information';
import {
  FundInformationFormData,
  useFundInformations,
} from '@/components/fund_information/useFundInformations';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/useToast';

const CreateFundInformation = () => {
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { year: yearParam } = router.query;
  const selectedYear =
    typeof yearParam === 'string' ? parseInt(yearParam, 10) : new Date().getFullYear();
  const { createFundInformation, incomeCategories, isLoading } = useFundInformations({
    selectedYear,
  });

  const incomeTypes = incomeCategories.map((income) => income.name).filter(Boolean) || [];

  const handleSubmit = async (formData: FundInformationFormData) => {
    const isCompanySponsor = formData.incomeType === '企業協賛金';
    if (isCompanySponsor && !formData.sponsorName) {
      setError('企業協賛金の場合は企業名を入力してください');
      toast({
        title: '入力エラー',
        description: '企業協賛金の場合は企業名を入力してください',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await createFundInformation(formData);
      toast({
        title: '作成成功',
        description: '収入報告が正常に作成されました',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error submitting income report:', error);
      setError('データの送信に失敗しました。');
      toast({
        title: '作成失敗',
        description: '収入報告の作成中にエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    history.back();
  };

  return (
    <MainLayout>
      <Head>
        <title>収入報告作成</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div className={`flex h-[calc(100vh-4rem)] items-center justify-center`}>
        <div
          className='
            min-w-75 w-full max-w-[60%] px-4 py-8
            sm:px-6
            lg:px-8
          '
        >
          <Title className='mb-6 text-center' title='収入報告作成' />
          {error && <p className='mb-4 text-center text-red-500'>{error}</p>}

          <FundInformationForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitButtonText='登録する'
            incomeTypes={incomeTypes}
            isIncomeTypesLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateFundInformation;
