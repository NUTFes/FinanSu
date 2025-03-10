import * as React from 'react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FC } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import formatNumber from '../common/Formatter';
import {
  useGetFinancialRecordsId,
  useGetDivisionsId,
  useGetFestivalItemsId,
  usePutFinancialRecordsId,
  usePutDivisionsId,
  usePutFestivalItemsId,
} from '@/generated/hooks';
import type { Division, FestivalItem, FinancialRecord } from '@/generated/model';
import { PrimaryButton, Input, Modal } from '@components/common';

export interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  phase: number;
  financialRecordId: number;
  divisionId: number;
  festivalItemId: number;
  onSuccess: () => void;
}

const EditBudgetManagementModal: FC<ModalProps> = (props) => {
  const { phase, financialRecordId, divisionId, festivalItemId, onSuccess } = props;

  const { data: financialRecordData } = useGetFinancialRecordsId(financialRecordId);
  const { data: divisionData } = useGetDivisionsId(divisionId);
  const { data: festivalItemData } = useGetFestivalItemsId(festivalItemId);

  const [financialRecord, setFinancialRecord] = useState<FinancialRecord | null>(
    financialRecordData?.data ?? null,
  );
  const [division, setDivision] = useState<Division | null>(divisionData?.data ?? null);
  const [festivalItem, setFestivalItem] = useState<FestivalItem | null>(
    festivalItemData?.data ?? null,
  );

  useEffect(() => {
    setFinancialRecord(financialRecordData?.data ?? null);
    setDivision(divisionData?.data ?? null);
    setFestivalItem(festivalItemData?.data ?? null);
  }, [financialRecordData, divisionData, festivalItemData]);

  const closeModal = () => {
    props.setShowModal(false);
  };

  // 文字列からカンマを除去して数値に変換
  const parseNumber = (str: string): number | null => {
    const unformatted = str.replace(/,/g, '');
    const parsed = parseInt(unformatted, 10);
    return isNaN(parsed) ? null : parsed;
  };

  // API呼び出し用フック（各フェーズで登録処理を実行）
  const { trigger: triggerFinancialRecord, isMutating: isMutatingFR } =
    usePutFinancialRecordsId(festivalItemId);
  const { trigger: triggerDivision, isMutating: isMutatingDiv } = usePutDivisionsId(divisionId);
  const { trigger: triggerFestivalItem, isMutating: isMutatingFI } =
    usePutFestivalItemsId(festivalItemId);

  // post処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      switch (phase) {
        case 1: {
          if (financialRecord === null) return;
          await triggerFinancialRecord(financialRecord);
          break;
        }
        case 2: {
          if (division === null) return;
          await triggerDivision(division);
          break;
        }
        case 3: {
          if (festivalItem === null) return;
          await triggerFestivalItem(festivalItem);
          break;
        }
      }
      closeModal();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      alert(`登録エラー: ${error.message}`);
    }
  };

  // 各フェーズで登録中の状態をまとめる
  const isMutating = isMutatingFR || isMutatingDiv || isMutatingFI;

  // 登録ボタンの無効化
  let isDisabled = false;
  // 各フェーズごとの入力フォーム
  let content;
  switch (phase) {
    case 1:
      isDisabled = !financialRecord?.name.trim() || isMutating;
      content = (
        <>
          <p>申請局名</p>
          <div className='col-span-4 w-full'>
            <Input
              value={financialRecord?.name}
              onChange={(e) =>
                setFinancialRecord({
                  ...financialRecord,
                  name: e.target.value,
                  year_id: financialRecord?.year_id ?? 0,
                })
              }
              placeholder='申請局名を入力'
            />
          </div>
        </>
      );
      break;
    case 2:
      isDisabled = !division?.name.trim() || isMutating;
      content = (
        <>
          <p>申請局名</p>
          <div className='col-span-4 w-full'>
            <p>{financialRecord?.name}</p>
          </div>
          <p>申請部門名</p>
          <div className='col-span-4 w-full'>
            <Input
              value={division?.name}
              onChange={(e) =>
                setDivision({
                  ...division,
                  name: e.target.value,
                  financialRecordID: division?.financialRecordID ?? 0,
                })
              }
              placeholder='申請部門名を入力'
            />
          </div>
        </>
      );
      break;
    case 3:
      isDisabled = !festivalItem?.name.trim() || festivalItem?.amount === null || isMutating;
      content = (
        <>
          <p>申請局名</p>
          <div className='col-span-4 w-full'>
            <p>{financialRecord?.name}</p>
          </div>
          <p>申請部門名</p>
          <div className='col-span-4 w-full'>
            <p>{division?.name}</p>
          </div>
          <p>申請物品名</p>
          <div className='col-span-4 w-full'>
            <Input
              value={festivalItem?.name}
              onChange={(e) =>
                setFestivalItem({
                  ...festivalItem,
                  name: e.target.value,
                  amount: festivalItem?.amount ?? 0,
                  divisionId: festivalItem?.divisionId ?? 0,
                  memo: festivalItem?.memo ?? '',
                })
              }
              placeholder='申請物品名を入力'
            />
          </div>
          <p>金額</p>
          <div className='col-span-4 w-full'>
            <Input
              value={festivalItem?.amount !== null ? formatNumber(festivalItem?.amount || 0) : ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setFestivalItem({
                    ...festivalItem,
                    name: festivalItem?.name ?? '',
                    amount: 0,
                    divisionId: festivalItem?.divisionId ?? 0,
                  });
                } else {
                  const parsed = parseNumber(value);
                  setFestivalItem({
                    ...festivalItem,
                    name: festivalItem?.name ?? '',
                    amount: parsed ?? 0,
                    divisionId: festivalItem?.divisionId ?? 0,
                  });
                }
              }}
              placeholder='金額を入力'
            />
          </div>
        </>
      );
      break;
    default:
      break;
  }

  return (
    <Modal className='md:w-1/2' onClick={closeModal}>
      <form onSubmit={handleSubmit}>
        <div className='ml-auto w-fit'>
          <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
        </div>
        <div className='mx-auto w-fit text-xl'>
          {phase === 1 && '申請局編集'}
          {phase === 2 && '申請部門編集'}
          {phase === 3 && '申請物品編集'}
        </div>
        <div className='my-10 grid grid-cols-5 items-center justify-items-center gap-5 text-black-600'>
          {content}
        </div>
        <div className='flex flex-col items-center justify-center gap-4'>
          <PrimaryButton disabled={isDisabled} type='submit'>
            {isMutating ? '登録中' : '更新する'}
          </PrimaryButton>
          <div className='cursor-default text-red-600 underline' onClick={closeModal}>
            キャンセル
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditBudgetManagementModal;
