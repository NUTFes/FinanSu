import { Box, Button, FormControl, FormLabel, Input, Select, VStack, Text } from '@chakra-ui/react';
import { Noto_Sans_JP } from 'next/font/google';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';
import { PrimaryButton, Title } from '@/components/common';
import MainLayout from '@/components/layout/MainLayout';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
});

// APIのつなぎ込み後に削除する。
const MOCK_DEPARTMENTS = [
  { id: 1, name: 'FinanSu部門' },
  { id: 2, name: 'Bingo部門' },
  { id: 3, name: 'インフラ部門' },
];

const MOCK_FESTIVAL_ITEMS = [
  { id: 1, name: '景品', departmentId: 2 },
  { id: 2, name: '文具', departmentId: 1 },
  { id: 3, name: '装飾品', departmentId: 2 },
];

interface BuyReport {
  id: number;
  departmentId: number;
  festivalItemID: number;
  festivalItemName: string;
  amount: number;
  paidBy: string;
}

const PurchaseReportPage = () => {
  const router = useRouter();
  const { from, reportId, festivalItemName, amount, paidBy } = router.query;
  const isFromReport = from === 'purchase_report_list';

  // 初期値を編集時と新規作成で分離しています。
  const getInitialBuyReport = (): BuyReport => {
    if (isFromReport) {
      return {
        id: Number(reportId) || 0,
        departmentId: 0,
        festivalItemID: MOCK_FESTIVAL_ITEMS.find((item) => item.name === festivalItemName)?.id || 0,
        festivalItemName: (festivalItemName as string) || '',
        amount: Number(amount) || 0,
        paidBy: (paidBy as string) || '',
      };
    }
    return {
      id: 0,
      departmentId: 0,
      festivalItemID: 0,
      festivalItemName: '',
      amount: 0,
      paidBy: '',
    };
  };

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [buyReport, setBuyReport] = useState<BuyReport>(getInitialBuyReport());

  const validateFile = (file: File): boolean => {
    const MAX_FILE_SIZE = 1_073_741_824;
    if (file.size > MAX_FILE_SIZE) {
      alert('ファイルサイズが1GBを超えています。別のファイルを選択してください。');
      return false;
    }
    if (!file.type.match(/(image\/.*|application\/pdf)/)) {
      alert('画像またはPDFファイルのみアップロード可能です。');
      return false;
    }
    return true;
  };

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

  const filteredFestivalItems = MOCK_FESTIVAL_ITEMS.filter(
    (item) => !buyReport.departmentId || item.departmentId === buyReport.departmentId,
  );

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
                  value={buyReport.departmentId || ''}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value) || 0;
                    setBuyReport((prev) => ({
                      ...prev,
                      departmentId: selectedId,
                      festivalItemID: 0,
                      festivalItemName: '',
                    }));
                  }}
                >
                  {MOCK_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                id='product'
                isRequired
                isDisabled={isFromReport || !buyReport.departmentId}
              >
                <FormLabel>物品</FormLabel>
                {isFromReport ? (
                  <Input value={buyReport.festivalItemName} disabled />
                ) : (
                  <Select
                    placeholder='選択してください'
                    value={buyReport.festivalItemID || ''}
                    onChange={(e) => {
                      const selectedId = parseInt(e.target.value) || 0;
                      const selectedItem = filteredFestivalItems.find(
                        (item) => item.id === selectedId,
                      );
                      setBuyReport((prev) => ({
                        ...prev,
                        festivalItemID: selectedId,
                        festivalItemName: selectedItem?.name || '',
                      }));
                    }}
                    isDisabled={!buyReport.departmentId}
                  >
                    {filteredFestivalItems.map((item) => (
                      <option key={item.id} value={item.id}>
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

              {!isFromReport && (
                <FormControl id='receipt-upload' isRequired>
                  <FormLabel>領収書（レシート）</FormLabel>
                  <input
                    type='file'
                    accept='image/jpeg,image/png,image/gif,application/pdf'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className='hidden'
                  />
                  {receiptFile ? (
                    <div className='border-gray-200 flex min-h-[40px] items-center gap-2 rounded-md border bg-[#E7E7E7] p-2'>
                      <Text className='ml-2 min-w-0 flex-1 truncate'>{receiptFile.name}</Text>
                    </div>
                  ) : (
                    <Button
                      className='w-full bg-[#E7E7E7]'
                      colorScheme='gray'
                      variant='outline'
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className='flex w-full items-center gap-2 font-normal'>
                        <GoPlus />
                        領収書（レシート）をアップロード
                      </span>
                    </Button>
                  )}
                  {!receiptFile && (
                    <Box className='mt-6 flex items-center justify-center gap-2'>
                      <FaExclamationCircle color='#B91C1C' />
                      <Text className='text-sm text-[#B91C1C]'>
                        領収書（レシート）をアップロードしてください
                      </Text>
                    </Box>
                  )}
                </FormControl>
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
                  (!isFromReport && !buyReport.festivalItemID)
                }
                className='mx-auto'
              >
                {isFromReport ? '更新する' : '登録する'}
              </PrimaryButton>
              <Button
                className='underline underline-offset-[5px]'
                colorScheme='red'
                variant='ghost'
                onClick={router.back}
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
