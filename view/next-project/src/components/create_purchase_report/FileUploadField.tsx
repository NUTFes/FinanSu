import { Button, FormControl, FormLabel, Text, Box } from '@chakra-ui/react';
import React, { RefObject } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';

interface FileUploadFieldProps {
  isFromReport: boolean;
  receiptFile: File | null;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  isFromReport,
  receiptFile,
  fileInputRef,
  handleFileChange,
}) => {
  return (
    <FormControl id='receipt-upload' isRequired={!isFromReport}>
      <FormLabel>{isFromReport ? '領収書（レシート）の変更' : '領収書（レシート）'}</FormLabel>
      <input
        type='file'
        accept='image/jpeg,image/png,image/gif,application/pdf'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
      />
      {receiptFile ? (
        <div
          className='border-gray-200 hover:bg-gray-300 flex min-h-[40px] cursor-pointer items-center gap-2 rounded-md border bg-[#E7E7E7] p-2 transition-colors'
          onClick={() => fileInputRef.current?.click()}
        >
          <Text className='ml-2 min-w-0 flex-1 truncate'>{receiptFile.name}</Text>
          <Text className='text-gray-500 mr-2 text-sm'>クリックして変更</Text>
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
            {isFromReport ? '領収書（レシート）を変更' : '領収書（レシート）をアップロード'}
          </span>
        </Button>
      )}
      {!receiptFile && !isFromReport && (
        <Box className='mt-6 flex items-center justify-center gap-2'>
          <FaExclamationCircle color='#B91C1C' />
          <Text className='text-sm text-[#B91C1C]'>
            領収書（レシート）をアップロードしてください
          </Text>
        </Box>
      )}
    </FormControl>
  );
};

export default FileUploadField;
