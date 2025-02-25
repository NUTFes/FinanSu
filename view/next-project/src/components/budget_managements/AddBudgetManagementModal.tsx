import { useRouter } from 'next/router';
import * as React from 'react';
import { Dispatch, SetStateAction, useState } from 'react';
import { FC } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { useGetFinancialRecords, useGetDivisions, usePostFestivalItems } from '@/generated/hooks';
import type {
  DivisionWithBalance,
  FestivalItem,
  FinancialRecordWithBalance,
  GetDivisionsParams,
} from '@/generated/model';
import { PrimaryButton, Input, Modal, Loading } from '@components/common';

export interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  financialRecord: FinancialRecordWithBalance[];
  divisions: DivisionWithBalance[];
}

const AddBudgetManagementModal: FC<ModalProps> = (props) => {
  const [financialRecordId, setFinancialRecordId] = useState<number | null>(null);
  const [divisionId, setDivisionId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>('');
  const [amount, setAmount] = useState<number | null>(null);

  const divisionsParams: GetDivisionsParams = {
    financial_record_id: financialRecordId ?? undefined,
  };

  const { trigger, data, error, isMutating } = usePostFestivalItems();

  const {
    data: financialRecordData,
    isLoading: isFinancialRecordLoading,
    error: financialRecordError,
  } = useGetFinancialRecords();
  const {
    data: divisionsData,
    isLoading: isDivisionsLoading,
    error: divisionsError,
  } = useGetDivisions(divisionsParams);

  const { financialRecords = [], total: financialRecordsTotal } = financialRecordData?.data || {};
  const { divisions = [], total: divisionsTotal } = divisionsData?.data || {};

  const handleFinancialRecordChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const frId = e.target.value;
    setFinancialRecordId(frId === '' ? null : parseInt(frId, 10));
    if (frId !== null) {
      setDivisionId(null);
    }
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const divId = e.target.value;
    setDivisionId(divId === '' ? null : parseInt(divId, 10));
  };

  const handlefestivalItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value ? e.target.value : null;
    setName(name);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value ? parseInt(e.target.value, 10) : null;
    setAmount(amount);
  };

  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const registBudget = async () => {
    const newItem: FestivalItem = {
      divisionId: divisionId ?? 0,
      amount: amount ?? 0,
      name: name ?? '',
      memo: '',
    };

    await trigger(newItem);
  };

  const isLoadingAll = isFinancialRecordLoading || isDivisionsLoading;
  if (isLoadingAll) {
    return <Loading />;
  }

  const isErrorOccurred = financialRecordError || divisionsError;
  if (isErrorOccurred) {
    return <div>error...</div>;
  }

  const isDisabled =
    financialRecordId === null ||
    divisionId === null ||
    !name ||
    name.trim() === '' ||
    amount === null ||
    isMutating;

  return (
    <Modal className='md:w-1/2'>
      <div className='ml-auto w-fit'>
        <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
      </div>
      <div className='mx-auto w-fit text-xl'>予算登録</div>
      <div className='my-10 grid grid-cols-5 items-center justify-items-center gap-5 text-black-600'>
        <p>申請局名</p>
        <div className='col-span-4 w-full'>
          <select
            value={financialRecordId ?? ''}
            onChange={handleFinancialRecordChange}
            className='border-b border-black-300 focus:outline-none'
          >
            <option value=''>ALL</option>
            {financialRecords &&
              financialRecords.map((financialRecord) => (
                <option key={financialRecord.id} value={financialRecord.id}>
                  {financialRecord.name}
                </option>
              ))}
          </select>
        </div>
        <p>申請部門名</p>
        <div className='col-span-4 w-full'>
          <select
            value={divisionId ?? ''}
            onChange={handleDivisionChange}
            className='border-b border-black-300 focus:outline-none'
          >
            <option value=''>ALL</option>
            {divisions &&
              divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
          </select>
        </div>
        <p>申請物品名</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={name ?? ''} onChange={handlefestivalItemChange} />
        </div>
        <p>金額</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={amount ?? ''} onChange={handleAmountChange} />
        </div>
      </div>
      <div className='flex flex-col items-center justify-center gap-4'>
        <PrimaryButton
          disabled={isDisabled}
          onClick={() => {
            registBudget();
            router.reload();
          }}
        >
          {isMutating ? '登録中' : '登録する'}
        </PrimaryButton>
        <div
          className='cursor-default text-red-600 underline'
          onClick={() => {
            closeModal();
          }}
        >
          キャンセル
        </div>
      </div>
    </Modal>
  );
};

export default AddBudgetManagementModal;
