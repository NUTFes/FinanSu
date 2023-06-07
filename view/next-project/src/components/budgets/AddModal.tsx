import { useRouter } from 'next/router';
import * as React from 'react';
import { Dispatch, SetStateAction, useState } from 'react';
import { FC } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { SOURCES } from '@/constants/sources';
import { YEARS } from '@/constants/years';
import { post } from '@api/budget';
import { PrimaryButton, Input, Modal, Select } from '@components/common';
import { Budget } from '@type/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const BudgetAddModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const [formData, setFormData] = useState<Budget>({
    price: 0,
    yearID: 1,
    sourceID: 1,
  });

  const router = useRouter();

  const handler =
    (input: string) =>
    (
      e:
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLInputElement>,
    ) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const registBudget = async (data: Budget) => {
    const registBudgetUrl = process.env.CSR_API_URI + '/budgets';
    await post(registBudgetUrl, data);
  };

  return (
    <Modal className='md:w-1/5'>
      <div className='ml-auto w-fit'>
        <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
      </div>
      <div className='mx-auto w-fit text-xl'>予算の編集</div>
      <div className='my-10 grid grid-cols-5 items-center justify-items-center gap-5 text-black-600'>
        <p>年度</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={formData.yearID} onChange={handler('yearID')}>
            {YEARS.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </Select>
        </div>
        <p>項目</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={formData.sourceID} onChange={handler('sourceID')}>
            {SOURCES.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </Select>
        </div>
        <p>金額</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.price} onChange={handler('price')} />
        </div>
      </div>
      <div className='flex justify-center'>
        <PrimaryButton
          onClick={() => {
            registBudget(formData);
            router.reload();
          }}
        >
          登録する
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default BudgetAddModal;
