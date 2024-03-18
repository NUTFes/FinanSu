import MainLayout from '@components/layout/MainLayout/MainLayout';
import * as Minio from 'minio';
import React, { useState, useEffect, useRef, InputHTMLAttributes, forwardRef } from 'react';
import { InputImage, PrimaryButton } from '@/components/common';
import { Document, Page } from 'react-pdf';

type Args = {
  file: File | null;
};

export const useGetImageUrl = ({ file }: Args) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!file) {
      return;
    }

    let reader: FileReader | null = new FileReader();
    reader.onloadend = () => {
      const base64 = reader && reader.result;
      if (base64 && typeof base64 === 'string') {
        setImageUrl(base64);
      }
    };
    reader.readAsDataURL(file);

    return () => {
      reader = null;
    };
  }, [file]);

  return {
    imageUrl,
  };
};

interface Props {
  number: number;
}

export const getServerSideProps = async () => {
  return {
    props: {
      number: 1,
    },
  };
};

export default function MinioTest(props: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadImageURL, setUploadImageURL] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0]!;
    setImageFile(targetFile);
    setUploadImageURL(URL.createObjectURL(targetFile));
  };

  const submit = async () => {
    if (!imageFile) {
      return;
    }
    const formData = new FormData();
    formData.append('file', imageFile);
    const fileName = imageFile?.name || '';
    formData.append('fileName', fileName);

    // console.log(...formData.entries());

    await fetch('/api/minio', {
      method: 'POST',

      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  };

  return (
    <>
      <div className='flex h-full items-center justify-center'>
        <input type='file' ref={fileInputRef} onChange={handleFileChange} />
        <PrimaryButton type='button' onClick={() => submit()}>
          送信
        </PrimaryButton>
        <div style={{ height: 20 }} />
        <button onClick={() => {}}>キャンセル</button>
      </div>
      {/* <Document file='http://127.0.0.1:9000/finansu/%E4%BB%A4%E5%92%8C6%E5%B9%B43%E6%9C%88%E5%AD%A6%E9%83%A8%E5%8D%92%E6%A5%AD%E8%80%85%E4%B8%80%E8%A6%A7.pdf'>
        <Page pageNumber={1} />
      </Document> */}
      <img src='/images/docker-copose.png' alt='Picture of the author' />
      <Document file='/images/令和6年3月学部卒業者一覧.pdf'>
        <Page pageNumber={1} />
      </Document>
    </>
  );
}
