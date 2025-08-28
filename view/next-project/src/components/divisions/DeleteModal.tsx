import clsx from 'clsx';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { CloseButton, SubmitButton } from '../common';
import Modal from '@components/common/Modal';

interface Division {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  deleteDivisions: {
    divisions: Division[];
    ids: number[];
  };
  setShowModal: (isShow: boolean) => void;
}

const DeleteModal: React.FC<Props> = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // モック実装 - 実際はAPI呼び出し
      console.log('Deleting divisions:', props.deleteDivisions.ids);

      // 成功時の処理
      alert(`${props.deleteDivisions.divisions.length}件の部門を削除しました`);
      props.setShowModal(false);
      router.reload(); // ページをリロード
    } catch (error) {
      console.error('Error deleting divisions:', error);
      alert('部門の削除に失敗しました');
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
        <p className='text-xl text-black-600'>部門削除</p>
      </div>
      <div className='mx-5'>
        <div className='my-3'>
          <p className='mb-4 text-sm text-black-600'>
            以下の部門を削除しますか？この操作は取り消せません。
          </p>
          <div className='bg-gray-50 mb-4 rounded p-4'>
            {props.deleteDivisions.divisions.map((division) => (
              <div key={division.id} className='mb-2'>
                <span className='font-medium'>ID: {division.id}</span> - {division.name}
              </div>
            ))}
          </div>
        </div>
        <div className='my-6 flex justify-center space-x-4'>
          <button
            onClick={() => props.setShowModal(false)}
            className='border-gray-300 hover:bg-gray-50 rounded border px-6 py-2'
            disabled={isLoading}
          >
            キャンセル
          </button>
          <SubmitButton
            text={isLoading ? '削除中...' : '削除'}
            onClick={handleDelete}
            disabled={isLoading}
            className='bg-red-500 hover:bg-red-600'
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
