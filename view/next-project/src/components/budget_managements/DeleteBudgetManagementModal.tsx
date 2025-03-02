import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { FC } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import {
  useDeleteFinancialRecordsId,
  useDeleteDivisionsId,
  useDeleteFestivalItemsId,
} from '@/generated/hooks';
import { PrimaryButton, Modal } from '@components/common';

export interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  phase: number;
  id: number;
  name: string;
  onSuccess?: (phase: number) => void;
}

const DeleteBudgetManagementModal: FC<ModalProps> = (props) => {
  const { phase, id, name, onSuccess } = props;

  const closeModal = () => {
    props.setShowModal(false);
  };

  // API呼び出し用フック（各フェーズで登録処理を実行）
  const { trigger: triggerFinancialRecord, isMutating: isMutatingFR } =
    useDeleteFinancialRecordsId(id);
  const { trigger: triggerDivision, isMutating: isMutatingDiv } = useDeleteDivisionsId(id);
  const { trigger: triggerFestivalItem, isMutating: isMutatingFI } = useDeleteFestivalItemsId(id);

  // post処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      switch (phase) {
        case 1: {
          await triggerFinancialRecord();
          break;
        }
        case 2: {
          await triggerDivision();
          break;
        }
        case 3: {
          await triggerFestivalItem();
          break;
        }
      }
      closeModal();

      if (onSuccess) {
        onSuccess(phase);
      }
    } catch (error: any) {
      console.error('削除エラー:', error.message);
      alert(`削除エラー: ${error.message}`);
    }
  };

  // 各フェーズで登録中の状態をまとめる
  const isMutating = isMutatingFR || isMutatingDiv || isMutatingFI;

  return (
    <Modal className='md:w-1/2' onClick={closeModal}>
      <form onSubmit={handleSubmit}>
        <div className='ml-auto w-fit'>
          <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
        </div>
        <div className='mx-auto w-fit text-xl'>
          {phase === 1 && '申請局削除'}
          {phase === 2 && '申請部門削除'}
          {phase === 3 && '申請物品削除'}
        </div>
        <div className='my-10 grid-cols-5 items-center justify-items-center gap-5 text-black-600'>
          <div className='mx-auto my-5 w-fit text-xl'>{name}を削除しますか？</div>
        </div>
        <div className='flex flex-col items-center justify-center gap-4'>
          <div className='flex gap-4'>
            <PrimaryButton disabled={isMutating} type='submit'>
              {isMutating ? '削除中' : '削除する'}
            </PrimaryButton>
          </div>
          <div className='cursor-default text-red-600 underline' onClick={closeModal}>
            キャンセル
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteBudgetManagementModal;
