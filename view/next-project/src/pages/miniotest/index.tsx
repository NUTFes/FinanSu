import MainLayout from '@components/layout/MainLayout/MainLayout';
import * as Minio from 'minio';
import React, { useState, useEffect, useRef, InputHTMLAttributes, forwardRef } from 'react';
import { InputImage, PrimaryButton } from '@/components/common';

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
  const [preview, setPreview] = useState({ uploadImageURL: '', type: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0]!;
    setImageFile(targetFile);
    setPreview({ uploadImageURL: URL.createObjectURL(targetFile), type: targetFile.type });
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
        {preview.type === 'application/pdf' ? (
          <embed src={preview.uploadImageURL} type='application/pdf' width='200' height='200' />
        ) : (
          preview.type !== '' && <img src={uploadImageURL} width='200' height='200' />
        )}
      </div>
      <div className='h-full'>
        画像表示テスト
        <embed
          src='http://127.0.0.1:9000/finansu/令和6年3月学部卒業者一覧.pdf'
          type='application/pdf'
          width='200'
          height='200'
        />
        <embed
          src='http://127.0.0.1:9000/finansu/go.png'
          type='image/png'
          width='200'
          height='200'
        />
        <img
          src='http://127.0.0.1:9000/finansu/go.png'
          alt='Picture of the author'
          width='200'
          height='200'
        />
      </div>
    </>
  );
}
