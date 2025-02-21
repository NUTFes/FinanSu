import { Box, Button, FormControl, FormLabel, Input, Select, VStack, Text } from '@chakra-ui/react';
import { Noto_Sans_JP } from 'next/font/google';
import React, { useRef, useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';
import { TbCameraPlus } from 'react-icons/tb';
import { PrimaryButton, Title } from '@/components/common';
import MainLayout from '@/components/layout/MainLayout';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
});

// APIのつなぎ込み後に削除する。
const MOCK_FESTIVAL_ITEMS = [
  { id: 1, name: '景品' },
  { id: 2, name: '文具' },
  { id: 3, name: '装飾品' },
  { id: 4, name: '食料品' },
];

interface BuyReport {
  id: number;
  festivalItemID: number;
  amount: number;
  paidBy: string;
}

const PurchaseReportPage = () => {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayFileName, setDisplayFileName] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [buyReport, setBuyReport] = useState<BuyReport>({
    id: 0,
    festivalItemID: 0,
    amount: 0,
    paidBy: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const processFileName = (fileName: string): { name: string; extension: string } => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return {
      name: lastDotIndex > -1 ? fileName.slice(0, lastDotIndex) : fileName,
      extension: lastDotIndex > -1 ? fileName.slice(lastDotIndex) : '',
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const targetFile = files[0];
    if (!validateFile(targetFile)) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      return;
    }

    const { name, extension } = processFileName(targetFile.name);
    setReceiptFile(targetFile);
    setDisplayFileName(name);
    setFileExtension(extension);
  };

  const handleFileNameEdit = () => {
    setIsEditing(true);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayFileName(e.target.value);
  };

  const handleFileNameSave = () => {
    setIsEditing(false);
    if (!displayFileName.trim() && receiptFile) {
      const { name } = processFileName(receiptFile.name);
      setDisplayFileName(name);
    }
  };

  const handleFileNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFileNameSave();
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setBuyReport((prev) => ({ ...prev, amount: Number(value) || 0 }));
  };

  return (
    <MainLayout>
      <Box
        className={`flex h-[calc(100vh-4rem)] items-center justify-center ${notoSansJP.className}`}
      >
        <Box className='w-full min-w-[300px] max-w-[60%] px-4 py-8 sm:px-6 lg:px-8'>
          <Title className='mb-6 text-center' title={'購入報告'} />
          <form className='space-y-6'>
            <VStack spacing={4} align='stretch'>
              <FormControl id='product' isRequired>
                <FormLabel>物品</FormLabel>
                <Select
                  placeholder='選択してください'
                  value={buyReport.festivalItemID || ''}
                  onChange={(e) =>
                    setBuyReport((prev) => ({
                      ...prev,
                      festivalItemID: parseInt(e.target.value) || 0,
                    }))
                  }
                >
                  {MOCK_FESTIVAL_ITEMS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl id='proposer' isRequired>
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

              <FormControl id='receipt' isRequired>
                <FormLabel>領収書（レシート）</FormLabel>
                <input
                  type='file'
                  accept='image/jpeg,image/png,image/gif,application/pdf'
                  capture='environment'
                  ref={cameraInputRef}
                  onChange={handleFileChange}
                  className='hidden'
                />
                <Button
                  className='w-full bg-[#E7E7E7]'
                  colorScheme='gray'
                  variant='outline'
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <span className='flex w-full items-center gap-2 font-normal'>
                    <TbCameraPlus />
                    タップして撮影する
                  </span>
                </Button>
              </FormControl>

              <FormControl id='receipt-upload' isRequired>
                <input
                  type='file'
                  accept='image/jpeg,image/png,image/gif,application/pdf'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className='hidden'
                />
                {receiptFile ? (
                  <div className='border-gray-200 flex min-h-[40px] items-center gap-2 rounded-md border bg-[#E7E7E7] p-2'>
                    {isEditing ? (
                      <Input
                        value={displayFileName}
                        onChange={handleFileNameChange}
                        onBlur={handleFileNameSave}
                        onKeyDown={handleFileNameKeyDown}
                        className='flex-1'
                        autoFocus
                        placeholder='ファイル名を入力してください'
                      />
                    ) : (
                      <Text
                        className='ml-2 min-w-0 flex-1 cursor-pointer truncate'
                        onClick={handleFileNameEdit}
                      >
                        {displayFileName}
                        {fileExtension}
                      </Text>
                    )}
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
            </VStack>
          </form>
          <Box className='mt-6 flex justify-center space-x-4'>
            <div className='flex flex-col gap-2'>
              <PrimaryButton
                disabled={
                  !receiptFile ||
                  !buyReport.paidBy ||
                  !buyReport.amount ||
                  !buyReport.festivalItemID
                }
                className='mx-auto'
              >
                登録する
              </PrimaryButton>
              <Button
                className='underline underline-offset-[5px]'
                colorScheme='red'
                variant='ghost'
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
