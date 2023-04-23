import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { expensePut } from '@/utils/api/budget';
import { PrimaryButton, OutlinePrimaryButton, CloseButton, Input, Modal } from '@components/common';
import { Expense } from '@type/common';

interface ModalProps {
  expense: Expense;
  expenseId: number | string;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ExpenseEditModal(props: ModalProps) {
  const router = useRouter();

  // 協賛スタイルのリスト
  const [formData, setFormData] = useState<Expense>(props.expense);

  const handler =
    (input: keyof Expense) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  // 協賛スタイルの登録と協賛スタイルの更新を行い、ページをリロード
  const submit = (data: Expense) => {
    updateExpense(data);
    router.reload();
  };

  // 協賛スタイルを更新
  const updateExpense = async (data: Expense) => {
    const updateExpenseUrl = process.env.CSR_API_URI + '/expenses/' + data.id;
    await expensePut(updateExpenseUrl, data);
  };

  // 協賛スタイルの情報
  const content = (data: Expense) => (
    <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
      <p className='text-black-600'>支出元名</p>
      <div className='col-span-4 w-full'>
        <Input
          type='text'
          className='w-full'
          id={String(data.id)}
          value={data.name}
          onChange={handler('name')}
        />
      </div>
    </div>
  );

  return (
    <Modal className='w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton
            onClick={() => {
              props.setIsOpen(false);
            }}
          />
        </div>
      </div>
      <div className='mx-auto mb-10 w-fit text-xl text-black-600'>支出の修正</div>
      <div className=''>
        {content(formData)}
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton
            onClick={() => {
              props.setIsOpen(false);
            }}
          >
            戻る
          </OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              submit(formData);
            }}
          >
            編集完了
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
