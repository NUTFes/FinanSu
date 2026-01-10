import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Spinner,
  FormErrorMessage,
  Center,
  RadioGroup,
  Radio,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { Noto_Sans_JP } from 'next/font/google';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import { PrimaryButton, Title } from '@/components/common';
import { useFundInformations } from '@/components/fund_information/useFundInformations';
import MainLayout from '@/components/layout/MainLayout';
import { Income } from '@/generated/model/income';
import { IncomeReceiveOption } from '@/generated/model/incomeReceiveOption';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
});

interface FormFieldProps {
  id: string;
  label: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
}

const FormField = ({
  id,
  label,
  isRequired = false,
  isDisabled = false,
  children,
}: FormFieldProps) => (
  <FormControl id={id} isRequired={isRequired} isDisabled={isDisabled}>
    <FormLabel>{label}</FormLabel>
    {children}
  </FormControl>
);

const EditFundInformation = () => {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const numId = typeof id === 'string' ? parseInt(id, 10) : undefined;

  const {
    currentIncome,
    incomeCategories,
    isLoading,
    error: hookError,
    updateFundInformation,
  } = useFundInformations(numId);

  const [incomeReport, setIncomeReport] = useState<Income>({
    id: numId,
    incomeId: 0,
    sponsorName: '',
    amount: 0,
    yearId: 0,
    receiveOption: undefined,
  });

  const [formErrors, setFormErrors] = useState({
    amountError: '',
    sponsorNameError: '',
  });

  // データ読み込みが完了したら、収入データをセット
  useEffect(() => {
    if (currentIncome) {
      setIncomeReport(currentIncome);
    }
  }, [currentIncome]);

  // 金額変更のハンドラー
  const handleAmountChange = (e: { target: { value: string } }) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '') {
      setIncomeReport((prev) => ({ ...prev, amount: 0 }));
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    const amount = parseInt(value, 10);
    setIncomeReport((prev) => ({ ...prev, amount }));
  };

  // 収入タイプ変更のハンドラー
  const handleIncomeTypeChange = (e: { target: { value: string } }) => {
    const selectedTypeId = parseInt(e.target.value, 10);
    const selectedType = incomeCategories.find((income) => income.id === selectedTypeId);

    if (selectedType) {
      setIncomeReport((prev) => ({
        ...prev,
        incomeId: selectedTypeId,
        sponsorName: selectedType.name === '企業協賛金' ? prev.sponsorName : undefined,
      }));
    }
  };

  // 支払い方法の変更ハンドラー
  const handlePaymentMethodChange = (value: string) => {
    setIncomeReport((prev) => ({
      ...prev,
      receiveOption: value === 'bank-transfer' ? 'transfer' : ('hand' as IncomeReceiveOption),
    }));
  };

  // フォーム送信処理
  const handleSubmit = async () => {
    const selectedType = incomeCategories.find((income) => income.id === incomeReport.incomeId);
    const isCompanySponsor = selectedType?.name === '企業協賛金';

    if (isCompanySponsor && !incomeReport.sponsorName) {
      setFormErrors((prev) => ({
        ...prev,
        sponsorNameError: '企業協賛金の場合は企業名を入力してください',
      }));
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
      const updatedReport = {
        ...incomeReport,
        sponsorName: isCompanySponsor ? incomeReport.sponsorName : undefined,
      };

      await updateFundInformation(updatedReport);
      toast({
        title: '更新成功',
        description: '収入データが正常に更新されました',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating income report:', error);
      toast({
        title: '更新エラー',
        description: '収入データの更新中にエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // フォームの検証
  useEffect(() => {
    // 金額の検証
    if (incomeReport.amount <= 0) {
      setFormErrors((prev) => ({
        ...prev,
        amountError: '金額は0より大きい数値を入力してください',
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, amountError: '' }));
    }

    // 企業名の検証
    const selectedType = incomeCategories.find((income) => income.id === incomeReport.incomeId);
    const isCompanySponsor = selectedType?.name === '企業協賛金';

    if (isCompanySponsor && !incomeReport.sponsorName) {
      setFormErrors((prev) => ({
        ...prev,
        sponsorNameError: '企業協賛金の場合は企業名を入力してください',
      }));
    } else {
      setFormErrors((prev) => ({
        ...prev,
        sponsorNameError: '',
      }));
    }
  }, [incomeReport.amount, incomeReport.incomeId, incomeReport.sponsorName, incomeCategories]);

  // 現在選択中の収入タイプ名を取得
  const selectedIncomeName = incomeCategories.find(
    (item) => item.id === incomeReport.incomeId,
  )?.name;
  const isCompanySponsor = selectedIncomeName === '企業協賛金';

  // 現在の支払い方法
  const currentPaymentMethod =
    incomeReport.receiveOption === 'transfer' ? 'bank-transfer' : 'hand-delivery';

  // フォームが有効かどうか
  const isFormValid =
    incomeReport.incomeId > 0 &&
    incomeReport.amount > 0 &&
    incomeReport.receiveOption &&
    (!isCompanySponsor || !!incomeReport.sponsorName) &&
    !formErrors.amountError &&
    !formErrors.sponsorNameError &&
    !isLoading;

  if (isLoading) {
    return (
      <MainLayout>
        <Box className='flex h-[calc(100vh-4rem)] items-center justify-center'>
          <Center>
            <Spinner size='xl' />
            <p className='ml-3'>データを読み込み中...</p>
          </Center>
        </Box>
      </MainLayout>
    );
  }

  if (hookError) {
    return (
      <MainLayout>
        <Box className='flex h-[calc(100vh-4rem)] items-center justify-center'>
          <Center>
            <p className='text-red-500'>
              収入データの取得中にエラーが発生しました。ページを更新してください。
            </p>
          </Center>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box
        className={`flex h-[calc(100vh-4rem)] items-center justify-center ${notoSansJP.className}`}
      >
        <Box className='w-full min-w-[300px] max-w-[60%] px-4 py-8 sm:px-6 lg:px-8'>
          <Title className='mb-6 text-center' title='収入データ修正' />

          <form className='space-y-6'>
            <VStack spacing={4} align='stretch'>
              <FormField id='incomeId' label='収入の種類' isRequired>
                <Select
                  placeholder='選択してください'
                  value={incomeReport.incomeId}
                  onChange={handleIncomeTypeChange}
                >
                  {incomeCategories.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              {isCompanySponsor && (
                <FormControl id='sponsorName' isRequired isInvalid={!!formErrors.sponsorNameError}>
                  <FormLabel>企業名</FormLabel>
                  <Input
                    type='text'
                    value={incomeReport.sponsorName || ''}
                    onChange={(e) =>
                      setIncomeReport((prev) => ({ ...prev, sponsorName: e.target.value }))
                    }
                    placeholder='企業名を入力してください'
                    required
                  />
                  {formErrors.sponsorNameError && (
                    <FormErrorMessage>{formErrors.sponsorNameError}</FormErrorMessage>
                  )}
                </FormControl>
              )}

              <FormControl id='amount' isRequired isInvalid={!!formErrors.amountError}>
                <FormLabel>金額</FormLabel>
                <Input
                  type='text'
                  value={incomeReport.amount.toLocaleString()}
                  onChange={handleAmountChange}
                  placeholder='金額を入力してください'
                  required
                />
                {formErrors.amountError && (
                  <FormErrorMessage>{formErrors.amountError}</FormErrorMessage>
                )}
              </FormControl>

              <FormField id='paymentMethod' label='支払い方法' isRequired>
                <RadioGroup value={currentPaymentMethod} onChange={handlePaymentMethodChange}>
                  <Stack direction='row'>
                    <Radio value='bank-transfer'>振込</Radio>
                    <Radio value='hand-delivery'>手渡し</Radio>
                  </Stack>
                </RadioGroup>
              </FormField>
            </VStack>
          </form>

          <Box className='mt-6 flex justify-center space-x-4'>
            <div className='flex flex-col gap-2'>
              <PrimaryButton disabled={!isFormValid} className='mx-auto' onClick={handleSubmit}>
                {isLoading ? <Spinner size='sm' color='white' mr={2} /> : null}
                更新する
              </PrimaryButton>
              <Button
                className='underline underline-offset-[5px]'
                colorScheme='red'
                variant='ghost'
                onClick={() => router.back()}
                isDisabled={isLoading}
              >
                キャンセル
              </Button>
            </div>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default EditFundInformation;
