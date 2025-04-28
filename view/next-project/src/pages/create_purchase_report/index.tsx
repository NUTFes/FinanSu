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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type React from 'react';
import { useRef, useState, useEffect } from 'react';
import { PrimaryButton, Title } from '@/components/common';
import FileUploadField from '@/components/create_purchase_report/FileUploadField';
import FormField from '@/components/create_purchase_report/FormField';
import { usePurchaseReportForm } from '@/components/create_purchase_report/usePurchaseReportForm';
import {
  validateFile,
  validateAmount,
  ERROR_MESSAGES,
} from '@/components/create_purchase_report/validators';
import MainLayout from '@/components/layout/MainLayout';

// スタイリング用定数
const CONTAINER_HEIGHT_CLASS = 'h-[calc(100vh-4rem)]';
const FORM_CONTAINER_CLASS = 'w-full min-w-[300px] max-w-[60%] px-4 py-8 sm:px-6 lg:px-8';

const PurchaseReportPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formErrors, setFormErrors] = useState({
    fileError: '',
    amountError: '',
  });

  const {
    isEditMode,
    purchaseReport,
    setPurchaseReport,
    uploadedFile,
    setUploadedFile,
    departments,
    festivalItems,
    activeDivisionId,
    handleSubmit,
    isProcessing,
    festivalItemName,
    divisionName,
    isReportDataLoading,
    handleAmountChange,
    handleDivisionChange,
    handleItemChange,
  } = usePurchaseReportForm(router);

  useEffect(() => {
    // アップロードファイルの検証
    if (uploadedFile) {
      const { isValid, errorMessage } = validateFile(uploadedFile, false);
      setFormErrors((prev) => ({
        ...prev,
        fileError: isValid ? '' : errorMessage || '',
      }));
    } else if (!isEditMode) {
      setFormErrors((prev) => ({
        ...prev,
        fileError: ERROR_MESSAGES.FILE_REQUIRED,
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, fileError: '' }));
    }

    // 金額の検証
    const { isValid, errorMessage } = validateAmount(purchaseReport.amount, false);
    setFormErrors((prev) => ({
      ...prev,
      amountError: isValid ? '' : errorMessage || '',
    }));
  }, [uploadedFile, isEditMode, purchaseReport.amount]);

  // ファイル変更処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const targetFile = files[0];
    const { isValid, errorMessage } = validateFile(targetFile);

    if (!isValid) {
      setFormErrors((prev) => ({ ...prev, fileError: errorMessage || '' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFormErrors((prev) => ({ ...prev, fileError: '' }));
    setUploadedFile(targetFile);
  };

  // フォームのバリデーション
  const isFormValid = isEditMode
    ? purchaseReport.amount > 0 &&
      !!purchaseReport.festivalItemID &&
      !isProcessing &&
      !formErrors.amountError
    : !!uploadedFile &&
      !!purchaseReport.paidBy &&
      purchaseReport.amount > 0 &&
      !!purchaseReport.festivalItemID &&
      !!activeDivisionId &&
      !isProcessing &&
      !formErrors.fileError &&
      !formErrors.amountError;

  // ローディング中の表示
  if (isEditMode && isReportDataLoading) {
    return (
      <MainLayout>
        <Box className={`flex ${CONTAINER_HEIGHT_CLASS} font-noto items-center justify-center`}>
          <Center>
            <Spinner size='xl' />
            <p className='ml-3'>データを読み込み中...</p>
          </Center>
        </Box>
      </MainLayout>
    );
  }

  const filteredFestivalItems = activeDivisionId ? festivalItems : [];

  return (
    <MainLayout>
      <Box className={`flex ${CONTAINER_HEIGHT_CLASS} font-noto items-center justify-center`}>
        <Box className={FORM_CONTAINER_CLASS}>
          <Title
            className='mb-6 text-center'
            title={isEditMode ? '購入報告編集' : '購入報告作成'}
          />

          <form className='space-y-6'>
            <VStack spacing={4} align='stretch'>
              {/* 部門選択フォーム */}
              <FormField id='department' label='部門' isRequired isDisabled={isEditMode}>
                {isEditMode && divisionName ? (
                  <Input value={divisionName || ''} disabled />
                ) : (
                  <Select
                    placeholder='選択してください'
                    value={activeDivisionId || ''}
                    onChange={handleDivisionChange}
                  >
                    {departments.map((dept) => (
                      <option key={dept.divisionId} value={dept.divisionId}>
                        {dept.name}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>

              {/* 物品選択フォーム */}
              <FormField id='product' label='物品' isRequired isDisabled={isEditMode}>
                {isEditMode && festivalItemName ? (
                  <Input value={festivalItemName || ''} disabled />
                ) : (
                  <Select
                    placeholder='選択してください'
                    value={purchaseReport.festivalItemID || ''}
                    onChange={handleItemChange}
                    isDisabled={!activeDivisionId}
                  >
                    {filteredFestivalItems.map((item) => (
                      <option key={item.festivalItemId} value={item.festivalItemId}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>

              {/* 立替者入力フォーム */}
              <FormField id='proposer' label='立替者' isRequired isDisabled={isEditMode}>
                <Input
                  type='text'
                  value={purchaseReport.paidBy}
                  onChange={(e) =>
                    setPurchaseReport((prev) => ({
                      ...prev,
                      paidBy: e.target.value,
                    }))
                  }
                  placeholder='立替者を入力してください'
                  required
                />
              </FormField>

              {/* 金額入力フォーム */}
              <FormControl id='amount' isRequired isInvalid={!!formErrors.amountError}>
                <FormLabel>金額</FormLabel>
                <Input
                  type='text'
                  value={purchaseReport.amount.toLocaleString()}
                  onChange={handleAmountChange}
                  placeholder='金額を入力してください'
                  required
                />
                {formErrors.amountError && (
                  <FormErrorMessage>{formErrors.amountError}</FormErrorMessage>
                )}
              </FormControl>

              {/* ファイルアップロードフォーム */}
              <FileUploadField
                isEditMode={isEditMode}
                uploadedFile={uploadedFile}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                validationError={formErrors.fileError}
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
