import { saveAs } from 'file-saver';
import React, { FC, useEffect, useState } from 'react';
import { FaChevronCircleLeft } from 'react-icons/fa';
import { FiPlusSquare } from 'react-icons/fi';
import { DeleteButton, OutlinePrimaryButton, PrimaryButton, Loading } from '../common';
import UploadFileModal from './UploadFileModal';
import { del, get, post } from '@api/api_methods';
import { Receipt } from '@type/common';

interface ModalProps {
  id: number;
  setPageNum: (isOpen: number) => void;
  year: string;
}

const DetailPage2: FC<ModalProps> = (props) => {
  const { id, setPageNum, year } = props;
  const toPage1 = () => {
    setPageNum(1);
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editReceipt, setEditReceipt] = useState<Receipt>();
  const [receiptsData, setReceiptsData] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getReceipts = async () => {
    const getReceiptURL = `${process.env.CSR_API_URI}/receipts/reports/${id}`;
    const res: Receipt[] = await get(getReceiptURL);
    setReceiptsData(res);
  };

  const createURL = (receipt: Receipt) => {
    const url = `${process.env.NEXT_PUBLIC_MINIO_ENDPONT}/${receipt.bucketName}/${year}/receipts/${receipt.fileName}`;
    return url;
  };

  const download = async (url: string, fileName: string) => {
    setIsLoading(true);
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, fileName);
    setIsLoading(false);
  };

  const handleCreateReceipt = async () => {
    const nullData: Receipt = {
      purchaseReportID: Number(id),
      bucketName: '',
      fileName: '',
      fileType: '',
      remark: '',
    };
    setEditReceipt(nullData);
    setIsOpen(true);
  };

  const handleDeleteReceipt = async (receipt: Receipt) => {
    // オブジェクト削除
    const formData = new FormData();
    formData.append('fileName', `${receipt?.fileName}`);
    formData.append('year', year);
    const deleteReceiptUrl = `${process.env.CSR_API_URI}/receipts/${String(receipt.id)}`;
    const newReceiptsData = receiptsData.filter((receiptData) => receiptData.id !== receipt.id);
    if (receipt.fileName === '') {
      await del(deleteReceiptUrl);
    } else {
      const confirm = window.confirm('本当に削除してよろしいですか？');
      if (confirm) {
        await fetch('/api/receipts', {
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
        await del(deleteReceiptUrl);
      } else {
        window.alert('キャンセルしました');
        return;
      }
    }
    setReceiptsData(newReceiptsData);
  };

  useEffect(() => {
    getReceipts();
  }, []);

  return (
    <div className='w-96 md:w-full'>
      <p className='mx-auto w-fit text-xl text-black-600'>登録済レシート</p>
      <div className='max-h-96 overflow-auto'>
        {receiptsData &&
          receiptsData.map((receipt) => (
            <>
              <div className='m-0 flex flex-row-reverse border-t border-primary-1 p-0'>
                <div className='mt-2 md:w-1/12'>
                  <button className=''>
                    <DeleteButton onClick={() => handleDeleteReceipt(receipt)} />
                  </button>
                </div>
              </div>
              <div className='flex flex-wrap justify-center'>
                {receipt?.fileType === 'application/pdf' && receipt?.fileName && (
                  <embed src={createURL(receipt)} type='application/pdf' width='200' />
                )}
                {receipt.fileType !== 'application/pdf' && receipt.fileName && (
                  <img src={createURL(receipt)} alt='Picture of the author' width='200' />
                )}
              </div>
              <div className='my-1 flex flex-wrap justify-center gap-7 '>
                {receipt.fileName !== '' && (
                  <div className='my-2 flex flex-wrap justify-center gap-2'>
                    <OutlinePrimaryButton
                      className='p-1'
                      onClick={() => {
                        setEditReceipt(receipt);
                        setIsOpen(true);
                      }}
                    >
                      変更
                    </OutlinePrimaryButton>
                    <PrimaryButton
                      onClick={() =>
                        receipt.fileName && download(createURL(receipt), receipt.fileName || '')
                      }
                      disabled={isLoading}
                    >
                      ダウンロード
                    </PrimaryButton>
                  </div>
                )}
              </div>
              {isLoading && <Loading />}
            </>
          ))}
        <div className='my-1 flex flex-wrap justify-center gap-7 border-t border-primary-1 p-2'>
          <button className='rounded hover:bg-grey-300'>
            <FiPlusSquare size={30} onClick={() => handleCreateReceipt()} />
          </button>
        </div>
      </div>
      <div className='mt-2'>
        <button onClick={() => toPage1()} className='rounded-full hover:bg-grey-300'>
          <FaChevronCircleLeft size={30} />
        </button>
      </div>
      {isOpen && (
        <UploadFileModal
          id={Number(id)}
          setIsOpen={setIsOpen}
          receipt={editReceipt}
          year={year}
          receiptsData={receiptsData}
          setReceiptsData={setReceiptsData}
        />
      )}
    </div>
  );
};

export default DetailPage2;
