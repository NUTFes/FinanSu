import React, { FC, useRef, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { PrimaryButton, Loading } from '../common';
import { put } from '@/utils/api/api_methods';
import { Modal } from '@components/common';
import { SponsorActivityInformation } from '@type/common';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files![0]!;
    if (!targetFile) {
      setPreview({ uploadImageURL: '', type: '' });
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

  const handleFileDelete = () => {
    setImageFile(null);
    setPreview({ uploadImageURL: '', type: '' });
    props.setIsOpen(false);
  };

  const objectDeleteHandle = async () => {
    const formData = new FormData();
    formData.append('fileName', `${activityInformation?.fileName}`);
    formData.append('year', year);
    const response = await fetch('/api/advertisements', {
      method: 'DELETE',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return true;
        } else {
          alert('削除に失敗');
          return false;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const splitFile = (file: File, chunkSize: number) => {
    const chunks = [];
    let offset = 0;
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      chunks.push(chunk);
      offset += chunkSize;
    }
    console.log(`ファイルを${chunks.length}個のチャンクに分割しました。`);
    return chunks;
  };

  const submit = async () => {
    if (!imageFile) {
      return;
    }

    //更新の場合削除
    if (activityInformation?.fileName !== '') {
      await objectDeleteHandle();
    }

    setIsLoading(true);

    const chunkSize = 50 * 1024 * 1024;
    const chunks = splitFile(imageFile, chunkSize);
    let fileUrl = '';

    for (let i = 0; i < chunks.length; i++) {
      const formData = new FormData();
      formData.append('file', chunks[i]);
      formData.append('fileName', imageFile.name);
      formData.append('year', year);
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', chunks.length.toString());

      console.log(`チャンク${i + 1}/${chunks.length}をアップロード中...`);

      try {
        const response = await fetch('/api/advertisements', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.message === '成功' || data.message === 'チャンク受信成功') {
          if (data.fileUrl) {
            fileUrl = data.fileUrl;
          }
          console.log(`チャンク${i + 1}/${chunks.length}のアップロード成功`);
          setUploadProgress(((i + 1) / chunks.length) * 100); // 進捗状況を更新
        } else {
          console.error(`チャンク${i + 1}/${chunks.length}のアップロード失敗: ${data.message}`);
          alert('登録に失敗しました');
          setIsLoading(false);
          onClose();
          return;
        }
      } catch (error) {
        console.error(`チャンク${i + 1}/${chunks.length}のアップロード失敗:`, error);
        alert('登録に失敗しました');
        setIsLoading(false);
        onClose();
        return;
      }
    }

    setIsLoading(false);

    const sponsorActivitiesUrl =
      process.env.CSR_API_URI + '/activity_informations/' + activityInformation?.id;
    const res = await put(sponsorActivitiesUrl, registerActivityInformation);
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

  const onClose = () => {
    handleFileDelete();
    props.setIsOpen(false);
  };

  return (
    <Modal className='md:h-6/12 md:mt-5 md:w-4/12' onClick={onClose}>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
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
        {isLoading && (
          <div className='mt-2 w-full text-center'>
            <p className='text-gray-600 text-sm'>{uploadProgress}% アップロード中...</p>
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
            <img src={preview.uploadImageURL} className='mx-auto object-scale-down ' />
          )
        )}
      </div>
      <div className='my-2 flex w-full flex-wrap justify-center'>
        <PrimaryButton type='button' onClick={() => submit()} disabled={isLoading && !imageFile}>
          登録
        </PrimaryButton>
      </div>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default UploadFileModal;
