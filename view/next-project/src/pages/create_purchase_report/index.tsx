import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { Noto_Sans_JP } from 'next/font/google';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { PrimaryButton, Title } from '@/components/common';
import FileUploadField from '@/components/create_purchase_report/FileUploadField';
import { usePurchaseReportForm } from '@/components/create_purchase_report/usePurchaseReportForm';
import { validateFile } from '@/components/create_purchase_report/validators';
import MainLayout from '@/components/layout/MainLayout';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
});

const PurchaseReportPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
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
    festivalItemName,
  } = usePurchaseReportForm(router);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const targetFile = files[0];
    if (!validateFile(targetFile)) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setReceiptFile(targetFile);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setBuyReport((prev) => ({ ...prev, amount: Number(value) || 0 }));
  };

  const filteredFestivalItems = selectedDepartmentId ? festivalItems : [];

  return (
    <MainLayout>
      <Box
        className={`flex h-[calc(100vh-4rem)] items-center justify-center ${notoSansJP.className}`}
      >
        <Box className='w-full min-w-[300px] max-w-[60%] px-4 py-8 sm:px-6 lg:px-8'>
          <Title
            className='mb-6 text-center'
            title={isFromReport ? '購入報告編集' : '購入報告作成'}
          />
          <form className='space-y-6'>
            <VStack spacing={4} align='stretch'>
              <FormControl id='department' isRequired isDisabled={isFromReport}>
                <FormLabel>部門</FormLabel>
                <Select
                  placeholder='選択してください'
                  value={selectedDepartmentId || ''}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value) || 0;
                    setSelectedDepartmentId(selectedId);
                    setBuyReport((prev) => ({
                      ...prev,
                      festivalItemID: 0,
                    }));
                  }}
                >
                  {departments.map((dept) => (
                    <option key={dept.divisionId} value={dept.divisionId}>
                      {dept.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                id='product'
                isRequired
                isDisabled={isFromReport || !selectedDepartmentId}
              >
                <FormLabel>物品</FormLabel>
                {isFromReport && festivalItemName ? (
                  <Input value={(festivalItemName as string) || ''} disabled />
                ) : (
                  <Select
                    placeholder='選択してください'
                    value={buyReport.festivalItemID || ''}
                    onChange={(e) => {
                      const selectedId = parseInt(e.target.value) || 0;
                      setBuyReport((prev) => ({
                        ...prev,
                        festivalItemID: selectedId,
                      }));
                    }}
                    isDisabled={!selectedDepartmentId}
                  >
                    {filteredFestivalItems.map((item) => (
                      <option key={item.festivalItemId} value={item.festivalItemId}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                )}
              </FormControl>

              <FormControl id='proposer' isRequired isDisabled={isFromReport}>
                <FormLabel>立替者</FormLabel>
                <Input
                  type='text'
                  value={buyReport.paidBy}
                  onChange={(e) =>
                    setBuyReport((prev) => ({
                      ...prev,
                      paidBy: e.target.value,
                    }))
                  }
                  placeholder='立替者を入力してください'
                  required
                />
              </FormControl>

              <FormControl id='amount' isRequired>
                <FormLabel>金額</FormLabel>
                <Input
                  type='text'
                  value={buyReport.amount.toLocaleString()}
                  onChange={handleAmountChange}
                  placeholder='金額を入力してください'
                  required
                />
              </FormControl>

              {(!isFromReport || (isFromReport && !receiptFile)) && (
                <FileUploadField
                  isFromReport={isFromReport}
                  receiptFile={receiptFile}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                />
              )}
            </VStack>
          </form>
          <Box className='mt-6 flex justify-center space-x-4'>
            <div className='flex flex-col gap-2'>
              <PrimaryButton
                disabled={
                  (!isFromReport && !receiptFile) ||
                  (!isFromReport && !buyReport.paidBy) ||
                  !buyReport.amount ||
                  (!isFromReport && !buyReport.festivalItemID) ||
                  !selectedDepartmentId ||
                  isProcessing
                }
                className='mx-auto'
                onClick={handleSubmit}
              >
                {isProcessing ? <Spinner size='sm' color='white' mr={2} /> : null}
                {isFromReport ? '更新する' : '登録する'}
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
