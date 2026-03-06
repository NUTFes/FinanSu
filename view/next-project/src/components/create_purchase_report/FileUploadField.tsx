import { RefObject } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';

import { FormControl, FormLabel } from '@/components/common';

interface FileUploadFieldProps {
  isEditMode: boolean;
  uploadedFile: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationError?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  isEditMode,
  uploadedFile,
  fileInputRef,
  handleFileChange,
  validationError,
}) => {
  const handleFileUploadClick = () => fileInputRef.current?.click();

  return (
    <FormControl id='receipt-upload' isRequired={!isEditMode} isInvalid={!!validationError}>
      <FormLabel>{isEditMode ? '領収書（レシート）の変更' : '領収書（レシート）'}</FormLabel>
      <input
        type='file'
        accept='image/jpeg,image/png,image/gif,application/pdf'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
      />
      {uploadedFile ? (
        <div
          className='
            flex min-h-10 cursor-pointer items-center gap-2 rounded-md border
            border-gray-200 bg-[#E7E7E7] p-2 transition-colors
            hover:bg-gray-300
          '
          onClick={handleFileUploadClick}
        >
          <span className='ml-2 min-w-0 flex-1 truncate'>{uploadedFile.name}</span>
          <span className='mr-2 text-sm text-gray-500'>クリックして変更</span>
        </div>
      ) : (
        <button
          type='button'
          className='
            flex w-full items-center justify-center gap-1 rounded-md border
            border-gray-300 bg-[#E7E7E7] px-4 py-2 text-black-300
            transition-colors
            hover:bg-gray-300
            sm:gap-2
          '
          onClick={handleFileUploadClick}
        >
          <GoPlus
            className='
              pt-px text-sm
              sm:text-base
            '
          />
          <span
            className='
              text-xs font-normal
              sm:text-sm
              md:text-base
            '
          >
            {isEditMode ? '領収書（レシート）を変更' : '領収書（レシート）をアップロード'}
          </span>
        </button>
      )}
      {validationError && !isEditMode ? (
        <div className='mt-6 flex items-center justify-center gap-2'>
          <FaExclamationCircle color='#B91C1C' className='pt-px' />
          <span className='text-sm text-[#B91C1C]'>{validationError}</span>
        </div>
      ) : (
        !uploadedFile &&
        !isEditMode && (
          <div className='mt-6 flex items-center justify-center gap-2'>
            <FaExclamationCircle color='#B91C1C' />
            <span className='text-sm text-[#B91C1C]'>
              領収書（レシート）をアップロードしてください
            </span>
          </div>
        )
      )}
    </FormControl>
  );
};

export default FileUploadField;
