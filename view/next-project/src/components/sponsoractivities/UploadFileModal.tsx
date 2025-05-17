import Image from 'next/image';
import React, { FC, useRef, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { put } from '@/utils/api/api_methods';
import { Modal } from '@components/common';
import { SponsorActivityInformation } from '@type/common';

import { PrimaryButton, Loading } from '../common';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  id: number;
  activityInformation?: SponsorActivityInformation;
  year: string;
  sponsorActivityInformations?: SponsorActivityInformation[];
  setSponsorActivityInformations: (
    sponsorActivityInformations: SponsorActivityInformation[],
  ) => void;
  setIsChange: (isChange: boolean) => void;
}

const UploadFileModal: FC<ModalProps> = (props) => {
  const { year, activityInformation } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState({ uploadImageURL: '', type: '' });
  const [registerActivityInformation, setRegisterActivityInformation] =
    useState<SponsorActivityInformation>(
      activityInformation || {
        activityID: props.id,
        bucketName: '',
        fileName: '',
        fileType: '',
        designProgress: 1,
        fileInformation: '',
      },
    );

  const sponsorActivityInformations = props.sponsorActivityInformations || [];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // ファイル選択時の処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setPreview({ uploadImageURL: '', type: '' });
      return;
    }
    const targetFile = files[0];

    const MAX_FILE_SIZE = 1_073_741_824;
    if (targetFile.size > MAX_FILE_SIZE) {
      alert('ファイルサイズが1GBを超えています。別のファイルを選択してください。');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setImageFile(targetFile);
    setPreview({ uploadImageURL: URL.createObjectURL(targetFile), type: targetFile.type });

    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
    const fileName = targetFile.name;
    const fileType = targetFile.type;

    setRegisterActivityInformation({
      ...registerActivityInformation,
      bucketName: bucketName || '',
      fileName: fileName,
      fileType: fileType,
    });
  };

  // ファイル削除時の処理
  const handleFileDelete = () => {
    setImageFile(null);
    setPreview({ uploadImageURL: '', type: '' });
    props.setIsOpen(false);
  };

  // オブジェクト削除処理
  const objectDeleteHandle = async () => {
    const formData = new FormData();
    formData.append('fileName', `${activityInformation?.fileName}`);
    formData.append('year', year);
    try {
      const response = await fetch('/api/advertisements', {
        method: 'DELETE',
        body: formData,
      });
      if (!response.ok) {
        alert('削除に失敗');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  // ファイルをチャンクに分割する関数
  const splitFile = (file: File, chunkSize: number) => {
    const chunks = [];
    let offset = 0;
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      chunks.push(chunk);
      offset += chunkSize;
    }
    return chunks;
  };

  // ファイルアップロード処理
  const submit = async () => {
    if (!imageFile) {
      return;
    }

    // 更新の場合、既存ファイルを削除
    if (activityInformation?.fileName) {
      await objectDeleteHandle();
    }

    setIsLoading(true);

    // ファイルをチャンクに分割してアップロード
    const SPLIT_NUMBER = 10;
    const chunkSize = imageFile.size / SPLIT_NUMBER;
    const chunks = splitFile(imageFile, chunkSize);

    for (let i = 0; i < chunks.length; i++) {
      const formData = new FormData();
      formData.append('file', chunks[i]);
      formData.append('fileName', imageFile.name);
      formData.append('year', year);
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', chunks.length.toString());

      const progress = Math.floor(((i + 1) / chunks.length) * 100);
      setUploadProgress(progress);

      try {
        const response = await fetch('/api/advertisements', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.message !== '成功' && data.message !== 'チャンク受信成功') {
          alert('登録に失敗しました');
          setIsLoading(false);
          onClose();
          return;
        }
      } catch (error) {
        alert('登録に失敗しました');
        setIsLoading(false);
        onClose();
        return;
      }
    }

    setIsLoading(false);

    // アップロード完了後の処理
    const sponsorActivitiesUrl =
      process.env.CSR_API_URI + '/activity_informations/' + activityInformation?.id;
    await put(sponsorActivitiesUrl, registerActivityInformation);
    const newSponsorActivityInformations = sponsorActivityInformations.map(
      (sponsorActivityInformation) => {
        if (sponsorActivityInformation.id === registerActivityInformation.id) {
          return registerActivityInformation;
        }
        return sponsorActivityInformation;
      },
    );
    props.setSponsorActivityInformations(newSponsorActivityInformations);

    alert('保存しました');
    props.setIsChange(true);

    onClose();
  };

  // モーダルを閉じる処理
  const onClose = () => {
    handleFileDelete();
    props.setIsOpen(false);
  };

  return (
    <Modal className='md:h-6/12 md:mt-5 md:w-5/12' onClick={onClose}>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <RiCloseCircleLine size={'23px'} color={'gray'} onClick={onClose} />
        </div>
      </div>
      <div className='my-2 flex flex-wrap justify-center gap-2'>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          className='file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm hover:file:bg-grey-300'
        />
        <p className='mt-2 text-sm text-red-500'>※ファイルサイズは1GB以下にしてください。</p>
        {isLoading && (
          <div className='mt-2 w-full text-center'>
            <p className='text-gray-600 text-sm'>
              {uploadProgress === 100 ? '処理中...' : `${uploadProgress}% アップロード中...`}
            </p>
          </div>
        )}
      </div>
      <div className='my-2 flex h-60 w-full flex-wrap justify-center overflow-auto'>
        {preview.type === 'application/pdf' ? (
          <embed
            src={preview.uploadImageURL}
            type='application/pdf'
            className='mx-auto object-scale-down '
          />
        ) : (
          preview.type !== '' && (
            <Image
              src={preview.uploadImageURL}
              alt='Preview'
              className='mx-auto object-scale-down'
              width={200}
              height={200}
            />
          )
        )}
      </div>
      <div className='my-2 flex w-full flex-wrap justify-center'>
        <PrimaryButton type='button' onClick={submit} disabled={isLoading && !imageFile}>
          登録
        </PrimaryButton>
      </div>
      {isLoading && <Loading value={uploadProgress} isProgress />}
    </Modal>
  );
};

export default UploadFileModal;
