import { useRouter } from 'next/router';
import * as React from 'react';
import { Dispatch, SetStateAction, useState } from 'react';
import { FC } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { usePostFestivalItems, usePostFinancialRecords, usePostDivisions } from '@/generated/hooks';
import type { Division, FestivalItem, FinancialRecord } from '@/generated/model';
import { Year } from '@/type/common';
import { PrimaryButton, Input, Modal } from '@components/common';

interface FinancialRecordWithId extends FinancialRecord {
  id: number;
}

interface DivisionWithId extends Division {
  id: number;
}

export interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  phase: number;
  year?: Year;
  fr?: FinancialRecordWithId;
  div?: DivisionWithId;
}

const AddBudgetManagementModal: FC<ModalProps> = (props) => {
  const { phase, year, fr, div } = props;
  const [financialRecordName, setFinancialRecordName] = useState(fr?.name ?? '');
  const [divisionName, setDivisionName] = useState(div?.name ?? '');
  const [festivalItemName, setFestivalItemName] = useState('');
  const [amount, setAmount] = useState<number | null>(null);

  console.log(phase);

  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  // 3桁ごとにカンマを付けるフォーマッタ
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US'); // ロケールに合わせて変更可能
  };

  // 文字列からカンマを除去して数値に変換
  const parseNumber = (str: string): number | null => {
    const unformatted = str.replace(/,/g, '');
    const parsed = parseInt(unformatted, 10);
    return isNaN(parsed) ? null : parsed;
  };

  // API呼び出し用フック（各フェーズで登録処理を実行）
  const { trigger: triggerFinancialRecord, isMutating: isMutatingFR } = usePostFinancialRecords();
  const { trigger: triggerDivision, isMutating: isMutatingDiv } = usePostDivisions();
  const { trigger: triggerFestivalItem, isMutating: isMutatingFI } = usePostFestivalItems();

  // 各フェーズの「次へ」または「登録する」ボタン押下時の処理
  const handleNext = async () => {
    try {
      if (phase === 1) {
        if (!financialRecordName.trim()) return;
        // 新規登録の場合
        const newRecord: FinancialRecord = {
          name: financialRecordName,
          year_id: year?.id ?? 0,
        };
        await triggerFinancialRecord(newRecord);
      } else if (phase === 2) {
        if (!divisionName.trim()) return;
        const newDivision: Division = {
          name: divisionName,
          // 登録済みのFinancialRecordのidを利用
          financialRecordID: fr?.id ?? 0,
        };
        await triggerDivision(newDivision);
      } else if (phase === 3) {
        if (!festivalItemName.trim() || amount === null) return;
        const newFestivalItem: FestivalItem = {
          name: festivalItemName,
          amount: amount,
          // 登録済みの部門IDを利用
          divisionId: div?.id ?? 0,
          memo: '',
        };
        await triggerFestivalItem(newFestivalItem);
      }
      router.reload();
      closeModal();
    } catch (error: any) {
      console.error('登録エラー:', error.message);
      alert(`登録エラー: ${error.message}`);
    }
  };

  // 各フェーズで登録中の状態をまとめる
  const isMutating = isMutatingFR || isMutatingDiv || isMutatingFI;
  // disable 状態は、各フェーズの入力値チェックおよび送信中の場合
  let isDisabled = false;
  if (phase === 1) {
    isDisabled = !financialRecordName.trim() || isMutating;
  } else if (phase === 2) {
    isDisabled = !divisionName.trim() || isMutating;
  } else if (phase === 3) {
    isDisabled = !festivalItemName.trim() || amount === null || isMutating;
  }

  // 各フェーズごとの入力フォーム
  let content;
  if (phase === 1) {
    content = (
      <>
        <p>申請局名</p>
        <div className='col-span-4 w-full'>
          <Input
            value={financialRecordName}
            onChange={(e) => setFinancialRecordName(e.target.value)}
            placeholder='申請局名を入力'
          />
        </div>
      </>
    );
  } else if (phase === 2) {
    content = (
      <>
        <p>申請局名</p>
        <div className='col-span-4 w-full'>
          <Input
            value={financialRecordName}
            readOnly
            className='bg-gray-100 pointer-events-none border-0'
          />
        </div>
        <p>申請部門名</p>
        <div className='col-span-4 w-full'>
          <Input
            value={divisionName}
            onChange={(e) => setDivisionName(e.target.value)}
            placeholder='申請部門名を入力'
          />
        </div>
      </>
    );
  } else if (phase === 3) {
    content = (
      <>
        <p>申請局名</p>
        <div className='col-span-4 w-full'>
          <Input
            value={financialRecordName}
            readOnly
            className='bg-gray-100 pointer-events-none border-0'
          />
        </div>
        <p>申請部門名</p>
        <div className='col-span-4 w-full'>
          <Input
            value={divisionName}
            readOnly
            className='bg-gray-100 pointer-events-none border-0'
          />
        </div>
        <p>申請物品名</p>
        <div className='col-span-4 w-full'>
          <Input
            value={festivalItemName}
            onChange={(e) => setFestivalItemName(e.target.value)}
            placeholder='申請物品名を入力'
          />
        </div>
        <p>金額</p>
        <div className='col-span-4 w-full'>
          <Input
            value={amount !== null ? formatNumber(amount) : ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setAmount(null);
              } else {
                const parsed = parseNumber(value);
                setAmount(parsed);
              }
            }}
            placeholder='金額を入力'
          />
        </div>
      </>
    );
  }

  return (
    <Modal className='md:w-1/2'>
      <div className='ml-auto w-fit'>
        <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
      </div>
      <div className='mx-auto w-fit text-xl'>
        {phase === 1 && '申請局登録'}
        {phase === 2 && '申請部門登録'}
        {phase === 3 && '申請物品登録'}
      </div>
      <div className='my-10 grid grid-cols-5 items-center justify-items-center gap-5 text-black-600'>
        {content}
      </div>
      <div className='flex flex-col items-center justify-center gap-4'>
        <div className='flex gap-4'>
          <PrimaryButton disabled={isDisabled} onClick={handleNext}>
            {isMutating ? '登録中' : '登録する'}
          </PrimaryButton>
        </div>
        <div className='cursor-default text-red-600 underline' onClick={closeModal}>
          キャンセル
        </div>
      </div>
    </Modal>
  );
};

export default AddBudgetManagementModal;
