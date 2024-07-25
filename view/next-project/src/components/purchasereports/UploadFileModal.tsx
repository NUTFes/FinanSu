import React, { FC, useRef, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { PrimaryButton, Loading } from '../common';
import { put } from '@/utils/api/api_methods';
import { Receipt } from '@type/common';
import { Modal } from '@components/common';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  id: number;
  receipt?: Receipt;
  year: string;
  receiptsData: Receipt[];
  setReceiptsData: (receiptsData: Receipt[]) => void;
}

const UplaodFileModal: FC<ModalProps> = (props) => {
  const { id, receipt, year, receiptsData, setReceiptsData } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState({ uploadImageURL: '', type: '' });

  // loadingの呼び出し
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  };

  const handleFileDelete = () => {
    setImageFile(null);
    setPreview({ uploadImageURL: '', type: '' });
    props.setIsOpen(false);
  };

  const objectDeleteHandle = async () => {
    const formData = new FormData();
    console.log(receipt?.fileName);
    formData.append('fileName', `${receipt?.fileName}`);
    formData.append('year', year);
    const response = await fetch('/api/receipts', {
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

  const submit = async () => {
    if (!imageFile) {
      return;
    }
    //更新の場合削除
    if (receipt?.fileName !== '') {
      objectDeleteHandle();
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', imageFile);
    const fileName = imageFile?.name || '';
    formData.append('fileName', `receipts/${fileName}`);
    formData.append('year', year);

    const response = await fetch('/api/receipts', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return true;
        } else {
          alert('登録に失敗しました');
          return false;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    if (!response) {
      onClose();
      return;
    }

    const sendReceipt: Receipt = {
      purchaseReportID: Number(id),
      bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME || '',
      fileName: imageFile.name,
      fileType: imageFile.type,
      remark: '',
    };

    const putReceiptURL = process.env.CSR_API_URI + `/receipts/${receipt?.id}`;
    const res = await put(putReceiptURL, sendReceipt);

    alert('保存しました');

    const newReceiptsData = receiptsData.map((receiptData) => {
      if (receiptData.id === res.id) {
        return res;
      } else {
        return receiptData;
      }
    });

    setReceiptsData(newReceiptsData);

    setIsLoading(false);

    onClose();
  };

  const onClose = () => {
    handleFileDelete();
    props.setIsOpen(false);
  };

  return (
    <Modal className='md:h-6/12 md:mt-5 md:w-4/12'>
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

export default UplaodFileModal;
