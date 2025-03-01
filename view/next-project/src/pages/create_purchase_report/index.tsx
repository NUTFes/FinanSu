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
} from '@chakra-ui/react';
import { Noto_Sans_JP } from 'next/font/google';
import { useRouter } from 'next/router';
import React, { useRef, useState, useEffect } from 'react';
import { PrimaryButton, Title } from '@/components/common';
import FileUploadField from '@/components/create_purchase_report/FileUploadField';
import { usePurchaseReportForm } from '@/components/create_purchase_report/usePurchaseReportForm';
import {
  validateFile,
  validateAmount,
  MAX_AMOUNT,
  ERROR_MESSAGES,
} from '@/components/create_purchase_report/validators';
import MainLayout from '@/components/layout/MainLayout';

// スタイリング用定数
const CONTAINER_HEIGHT_CLASS = 'h-[calc(100vh-4rem)]';
const FORM_CONTAINER_CLASS = 'w-full min-w-[300px] max-w-[60%] px-4 py-8 sm:px-6 lg:px-8';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
});

const PurchaseReportPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');

  const {
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
    divisionName,
  } = usePurchaseReportForm(router);

  // アップロードファイルの検証
  useEffect(() => {
    if (uploadedFile) {
      const { isValid, errorMessage } = validateFile(uploadedFile, false);
      setFileError(isValid ? '' : errorMessage || '');
    } else if (!isEditMode) {
      setFileError(ERROR_MESSAGES.FILE_REQUIRED);
    }
  }, [uploadedFile, isEditMode]);

  // 金額の検証
  useEffect(() => {
    const { isValid, errorMessage } = validateAmount(purchaseReport.amount, false);
    setAmountError(isValid ? '' : errorMessage || '');
  }, [purchaseReport.amount]);

  // ファイル変更処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const targetFile = files[0];
    const { isValid, errorMessage } = validateFile(targetFile);

    if (!isValid) {
      setFileError(errorMessage || '');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFileError('');
    setUploadedFile(targetFile);
  };

  // 金額入力処理
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const numValue = value === '' ? 0 : Number(value);
    const limitedValue = Math.min(numValue, MAX_AMOUNT);
    setPurchaseReport((prev) => ({ ...prev, amount: limitedValue }));
  };

  // 部門選択処理
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value) || 0;
    setSelectedDivisionId(selectedId);
    setPurchaseReport((prev) => ({ ...prev, festivalItemID: 0 }));
  };

  // 物品選択処理
  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value) || 0;
    setPurchaseReport((prev) => ({ ...prev, festivalItemID: selectedId }));
  };

  // フォーム送信の検証
  const isFormValid = isEditMode
    ? purchaseReport.amount > 0 && !!purchaseReport.festivalItemID && !isProcessing && !amountError
    : !!uploadedFile &&
      !!purchaseReport.paidBy &&
      purchaseReport.amount > 0 &&
      !!purchaseReport.festivalItemID &&
      !!selectedDivisionId &&
      !isProcessing &&
      !fileError &&
      !amountError;

  const filteredFestivalItems = selectedDivisionId && !isEditMode ? festivalItems : [];

  return (
    <MainLayout>
      <Box
        className={`flex ${CONTAINER_HEIGHT_CLASS} items-center justify-center ${notoSansJP.className}`}
      >
        <Box className={FORM_CONTAINER_CLASS}>
          <Title
            className='mb-6 text-center'
            title={isEditMode ? '購入報告編集' : '購入報告作成'}
          />

          <form className='space-y-6'>
            <VStack spacing={4} align='stretch'>
              {/* 部門選択フォーム */}
              <FormControl id='department' isRequired isDisabled={isEditMode}>
                <FormLabel>部門</FormLabel>
                {isEditMode && divisionName ? (
                  <Input value={divisionName || ''} disabled />
                ) : (
                  <Select
                    placeholder='選択してください'
                    value={selectedDivisionId || ''}
                    onChange={handleDivisionChange}
                  >
                    {departments.map((dept) => (
                      <option key={dept.divisionId} value={dept.divisionId}>
                        {dept.name}
                      </option>
                    ))}
                  </Select>
                )}
              </FormControl>

              {/* 物品選択フォーム */}
              <FormControl id='product' isRequired isDisabled={isEditMode}>
                <FormLabel>物品</FormLabel>
                {isEditMode && festivalItemName ? (
                  <Input value={festivalItemName || ''} disabled />
                ) : (
                  <Select
                    placeholder='選択してください'
                    value={purchaseReport.festivalItemID || ''}
                    onChange={handleItemChange}
                    isDisabled={!selectedDivisionId}
                  >
                    {filteredFestivalItems.map((item) => (
                      <option key={item.festivalItemId} value={item.festivalItemId}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                )}
              </FormControl>

              {/* 立替者入力フォーム */}
              <FormControl id='proposer' isRequired>
                <FormLabel>立替者</FormLabel>
                <Input
                  type='text'
                  value={purchaseReport.paidBy}
                  onChange={(e) =>
                    setPurchaseReport((prev) => ({ ...prev, paidBy: e.target.value }))
                  }
                  placeholder='立替者を入力してください'
                  required
                  disabled={isEditMode}
                />
              </FormControl>

              {/* 金額入力フォーム */}
              <FormControl id='amount' isRequired isInvalid={!!amountError}>
                <FormLabel>金額</FormLabel>
                <Input
                  type='text'
                  value={purchaseReport.amount.toLocaleString()}
                  onChange={handleAmountChange}
                  placeholder='金額を入力してください'
                  required
                />
                {amountError && <FormErrorMessage>{amountError}</FormErrorMessage>}
              </FormControl>

              {/* ファイルアップロードフォーム */}
              <FileUploadField
                isEditMode={isEditMode}
                uploadedFile={uploadedFile}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                validationError={fileError}
              />
            </VStack>
          </form>

          {/* フォームアクション */}
          <Box className='mt-6 flex justify-center space-x-4'>
            <div className='flex flex-col gap-2'>
              <PrimaryButton disabled={!isFormValid} className='mx-auto' onClick={handleSubmit}>
                {isProcessing ? <Spinner size='sm' color='white' mr={2} /> : null}
                {isEditMode ? '更新する' : '登録する'}
              </PrimaryButton>
              <Button
                className='underline underline-offset-[5px]'
                colorScheme='red'
                variant='ghost'
                onClick={router.back}
                isDisabled={isProcessing}
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

export default PurchaseReportPage;
