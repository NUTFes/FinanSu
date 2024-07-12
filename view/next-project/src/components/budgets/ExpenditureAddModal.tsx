import { useRouter } from 'next/router';
import * as React from 'react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { FC } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { postExpenses } from '@api/budget';
import { PrimaryButton, Input, Modal, Select } from '@components/common';
import { Expense, Year } from '@type/common';

export interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  years: Year[];
}

const ExpenseAddModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const [formData, setFormData] = useState<Expense>({
    yearID: props.years ? Number(props.years[props.years.length - 1].id) : 1,
    name: '',
    totalPrice: 0,
  });

  const isEnabled = useMemo(() => {
    return formData.name !== '' ? false : true;
  }, [formData]);

  const router = useRouter();

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const registExpenses = async (data: Expense) => {
    const registExpensesUrl = process.env.CSR_API_URI + '/expenses';
    await postExpenses(registExpensesUrl, data);
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='ml-auto w-fit'>
        <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
      </div>
      <div className='mx-auto w-fit text-xl'>支出元の登録</div>
      <div className='my-10 grid grid-cols-5 items-center justify-items-center gap-5 text-black-600'>
        <p>年度</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={formData.yearID} onChange={handler('yearID')}>
            {props.years.map((year) => (
              <option key={year.id} value={year.id}>
                {year.year}
              </option>
            ))}
          </Select>
        </div>
        <p>支出元</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.name} onChange={handler('name')} />
        </div>
      </div>
      <div className='flex justify-center'>
        <PrimaryButton
          onClick={() => {
            registExpenses(formData);
            router.reload();
          }}
          disabled={isEnabled}
        >
          登録する
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default ExpenseAddModal;
