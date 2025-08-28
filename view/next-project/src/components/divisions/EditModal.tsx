import clsx from 'clsx';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { CloseButton, Input, SubmitButton } from '../common';
import Modal from '@components/common/Modal';

interface Division {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  id: number;
  division: Division;
  setShowModal: (isShow: boolean) => void;
}

const EditModal: React.FC<Props> = (props) => {
  const router = useRouter();
  const [name, setName] = useState(props.division.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('部門名を入力してください');
      return;
    }

    setIsLoading(true);
    try {
      // モック実装 - 実際はAPI呼び出し
      console.log('Updating division:', { id: props.id, name });
      
      // 成功時の処理
      alert('部門を更新しました');
      props.setShowModal(false);
      router.reload(); // ページをリロード
    } catch (error) {
      console.error('Error updating division:', error);
      alert('部門の更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='ml-auto mr-5 w-fit'>
        <CloseButton onClick={() => props.setShowModal(false)} />
      </div>
      <div className='mx-auto mb-10 w-fit'>
        <p className='text-xl text-black-600'>部門編集</p>
      </div>
      <div className='mx-5'>
        <div className='my-3'>
          <p className='text-sm text-black-600'>部門名</p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='部門名を入力してください'
            className='w-full'
            disabled={isLoading}
          />
        </div>
        <div className='my-6 flex justify-center'>
          <SubmitButton
            text={isLoading ? '更新中...' : '更新'}
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;