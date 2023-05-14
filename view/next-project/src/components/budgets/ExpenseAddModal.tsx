import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { CloseButton, Input, Modal, PrimaryButton, Select } from '@components/common';
import { Year } from '@type/common';
import { expensePost } from '@utils/api/budget';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
  years: Year[];
}

interface FormData {
  yearID: number;
  name: string;
}

export default function ExpenseAddModal(props: ModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    yearID: 1,
    name: '',
  });

  const handler =
    (input: keyof FormData) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const addSponsorStyle = async (data: FormData) => {
    const addSponsorUrl = process.env.CSR_API_URI + '/expenses';
    await expensePost(addSponsorUrl, data);
  };

  const submit = async (formData: FormData) => {
    addSponsorStyle(formData);
    props.setIsOpen(false);
    router.reload();
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <CloseButton onClick={() => props.setIsOpen(false)} />
        </div>
      </div>
      <h1 className='mx-auto mb-10 w-fit text-xl text-black-600'>支出の登録</h1>
      <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
        <p className='text-black-600'>支出元名</p>
        <div className='col-span-4 w-full'>
          <Input type='text' className='w-full' value={formData.name} onChange={handler('name')} />
        </div>
        <div className='text-black-600'>年</div>
        <div className='col-span-4 grid w-full'>
          <Select className='w-full' value={formData.yearID} onChange={handler('yearID')}>
            {props.years.map((year) => (
              <option key={year.id} value={year.id}>
                {year.year}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit'>
        <PrimaryButton
          className={'mx-2'}
          onClick={() => {
            submit(formData);
          }}
        >
          登録する
        </PrimaryButton>
      </div>
    </Modal>
  );
}
