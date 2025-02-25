import { useRouter } from 'next/router';
import * as React from 'react';
import { Dispatch, SetStateAction, useState } from 'react';
import { FC } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import {
  usePostFestivalItems,
  usePostFinancialRecords,
  usePostDivisions,
  usePutFinancialRecordsId,
  usePutDivisionsId,
} from '@/generated/hooks';
import type { Division, FestivalItem, FinancialRecord } from '@/generated/model';
import { Year } from '@/type/common';
import { PrimaryButton, Input, Modal } from '@components/common';

export interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  year: Year;
}

interface FinancialRecordWithId extends FinancialRecord {
  id: number;
}

interface DivisionWithId extends Division {
  id: number;
}

const AddBudgetManagementModal: FC<ModalProps> = (props) => {
  const [financialRecordName, setFinancialRecordName] = useState('');
  const [divisionName, setDivisionName] = useState('');
  const [festivalItemName, setFestivalItemName] = useState('');
  const [amount, setAmount] = useState<number | null>(null);

  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  // 登録フェーズ（1: 申請局, 2: 申請部門, 3: 申請物品）
  const [phase, setPhase] = useState(1);

  // 登録済みの結果（IDなど）を保持する state
  const [registeredFinancialRecord, setRegisteredFinancialRecord] =
    useState<FinancialRecordWithId | null>(null);
  const [registeredDivision, setRegisteredDivision] = useState<DivisionWithId | null>(null);

  // API呼び出し用フック（各フェーズで登録処理を実行）
  const { trigger: triggerFinancialRecord, isMutating: isMutatingFR } = usePostFinancialRecords();
  const { trigger: triggerDivision, isMutating: isMutatingDiv } = usePostDivisions();
  const { trigger: triggerFestivalItem, isMutating: isMutatingFI } = usePostFestivalItems();
  const { trigger: updateFinancialRecord, isMutating: isMutatingUpdateFR } =
    usePutFinancialRecordsId(registeredFinancialRecord?.id ?? 0);
  const { trigger: updateDivision, isMutating: isMutatingUpdateDiv } = usePutDivisionsId(
    registeredDivision?.id ?? 0,
    {},
  );

  // 各フェーズの「次へ」または「登録する」ボタン押下時の処理
  const handleNext = async () => {
    try {
      if (phase === 1) {
        if (!financialRecordName.trim()) return;
        if (!registeredFinancialRecord) {
          // 新規登録の場合
          const newRecord: FinancialRecord = {
            name: financialRecordName,
            year_id: props.year.id ?? 0,
          };
          const response = await triggerFinancialRecord(newRecord);
          const recordWithId: FinancialRecordWithId = {
            ...newRecord,
            id: response.data.id ?? 0,
          };
          setRegisteredFinancialRecord(recordWithId);
        } else {
          // 登録済みの場合は更新APIを呼び出す
          const updatedRecord: FinancialRecord = {
            ...registeredFinancialRecord,
            name: financialRecordName,
            year_id: props.year.id ?? 0,
          };
          await updateFinancialRecord(updatedRecord);
          setRegisteredFinancialRecord({ ...updatedRecord, id: registeredFinancialRecord.id });
        }
        setPhase(2);
      } else if (phase === 2) {
        if (!divisionName.trim()) return;
        if (!registeredDivision) {
          const newDivision: Division = {
            name: divisionName,
            // 登録済みのFinancialRecordのidを利用
            financialRecordID: registeredFinancialRecord?.id ?? 0,
          };
          const response = await triggerDivision(newDivision);
          const divisionWithId: DivisionWithId = {
            ...newDivision,
            id: response.data.id ?? 0,
          };
          setRegisteredDivision(divisionWithId);
        } else {
          const updatedDivision: Division = {
            ...registeredDivision,
            name: divisionName,
            financialRecordID: registeredFinancialRecord?.id ?? 0,
          };
          await updateDivision(updatedDivision);
          setRegisteredDivision({ ...updatedDivision, id: registeredDivision.id });
        }
        setPhase(3);
      } else if (phase === 3) {
        if (!festivalItemName.trim() || amount === null) return;
        const newFestivalItem: FestivalItem = {
          name: festivalItemName,
          amount: amount,
          // 登録済みの部門IDを利用
          divisionId: registeredDivision?.id ?? 0,
          memo: '',
        };
        await triggerFestivalItem(newFestivalItem);
        router.reload();
        closeModal();
      }
    } catch (error: any) {
      console.error('登録エラー:', error.message);
      alert(`登録エラー: ${error.message}`);
    }
  };

  const handleBack = () => {
    if (phase > 1) setPhase(phase - 1);
  };

  // 各フェーズで登録中の状態をまとめる
  const isMutating =
    isMutatingFR || isMutatingUpdateFR || isMutatingDiv || isMutatingUpdateDiv || isMutatingFI;
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
            value={amount ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setAmount(null);
              } else {
                const parsed = parseInt(value, 10);
                setAmount(isNaN(parsed) ? null : parsed);
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
          {phase > 1 && <PrimaryButton onClick={handleBack}>戻る</PrimaryButton>}
          <PrimaryButton disabled={isDisabled} onClick={handleNext}>
            {isMutating ? '登録中' : phase === 3 ? '登録する' : '次へ'}
          </PrimaryButton>
        </div>
        <div className='cursor-default text-red-600 underline' onClick={closeModal}>
          キャンセル
        </div>
      </div>
    </Modal>
  );

  // return (
  //   <Modal className='md:w-1/2'>
  //     <div className='ml-auto w-fit'>
  //       <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
  //     </div>
  //     <div className='mx-auto w-fit text-xl'>予算登録</div>
  //     <div className='my-10 grid grid-cols-5 items-center justify-items-center gap-5 text-black-600'>
  //       <p>申請局名</p>
  //       <div className='col-span-4 w-full'>
  //         <select
  //           value={financialRecordId ?? ''}
  //           onChange={handleFinancialRecordChange}
  //           className='border-b border-black-300 focus:outline-none'
  //         >
  //           <option value=''>ALL</option>
  //           {financialRecords &&
  //             financialRecords.map((financialRecord) => (
  //               <option key={financialRecord.id} value={financialRecord.id}>
  //                 {financialRecord.name}
  //               </option>
  //             ))}
  //         </select>
  //       </div>
  //       <p>申請部門名</p>
  //       <div className='col-span-4 w-full'>
  //         <select
  //           value={divisionId ?? ''}
  //           onChange={handleDivisionChange}
  //           className='border-b border-black-300 focus:outline-none'
  //         >
  //           <option value=''>ALL</option>
  //           {divisions &&
  //             divisions.map((division) => (
  //               <option key={division.id} value={division.id}>
  //                 {division.name}
  //               </option>
  //             ))}
  //         </select>
  //       </div>
  //       <p>申請物品名</p>
  //       <div className='col-span-4 w-full'>
  //         <Input className='w-full' value={name ?? ''} onChange={handlefestivalItemChange} />
  //       </div>
  //       <p>金額</p>
  //       <div className='col-span-4 w-full'>
  //         <Input className='w-full' value={amount ?? ''} onChange={handleAmountChange} />
  //       </div>
  //     </div>
  //     <div className='flex flex-col items-center justify-center gap-4'>
  //       <PrimaryButton
  //         disabled={isDisabled}
  //         onClick={() => {
  //           registBudget();
  //           router.reload();
  //         }}
  //       >
  //         {isMutating ? '登録中' : '登録する'}
  //       </PrimaryButton>
  //       <div
  //         className='cursor-default text-red-600 underline'
  //         onClick={() => {
  //           closeModal();
  //         }}
  //       >
  //         キャンセル
  //       </div>
  //     </div>
  //   </Modal>
  // );
};

export default AddBudgetManagementModal;
