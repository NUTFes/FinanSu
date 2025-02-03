import { useRouter } from 'next/router';
import { useQueryStates, parseAsInteger } from 'nuqs';
import * as React from 'react';
import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react';
import { FC } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import {
  Department,
  Division,
  Item,
  fetchDepartments,
  fetchDivisions,
  fetchItems,
} from './mockApi';
import { postExpenses } from '@api/budget';
import { PrimaryButton, Input, Modal, Select } from '@components/common';
import { Expense, Year } from '@type/common';

export interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  years: Year[];
}

const AddBudgetManagementModal: FC<ModalProps> = (props) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const [{ departmentId, divisionId }, setQueryState] = useQueryStates({
    departmentId: parseAsInteger.withOptions({ history: 'push', shallow: true }),
    divisionId: parseAsInteger.withOptions({ history: 'push', shallow: true }),
  });

  useEffect(() => {
    fetchDepartments().then(setDepartments);
  }, []);

  // FIXME: APIが実装されたら、修正する。
  useEffect(() => {
    if (departmentId !== null) {
      fetchDivisions(departmentId).then(setDivisions);
      setItems([]);
    } else {
      setDivisions([]);
      setQueryState({ divisionId: null });
      setItems([]);
    }
  }, [departmentId]);

  useEffect(() => {
    if (divisionId !== null) {
      fetchItems(divisionId).then(setItems);
    } else {
      setItems([]);
    }
  }, [divisionId]);

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
      <div className='mx-auto w-fit text-xl'>予算登録</div>
      <div className='my-10 grid grid-cols-5 items-center justify-items-center gap-5 text-black-600'>
        <p>支出元</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={formData.yearID} onChange={handler('departmentID')}>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </Select>
        </div>
        <p>部門</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={formData.yearID} onChange={handler('divisionID')}>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </Select>
        </div>
        <p>物品</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.name} onChange={handler('item')} />
        </div>
        <p>立替者</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={formData.yearID} onChange={handler('user')}>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </Select>
        </div>
        <p>金額</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.name} onChange={handler('price')} />
        </div>
      </div>
      <div className='flex justify-center gap-4'>
        <PrimaryButton
          onClick={() => {
            registExpenses(formData);
            router.reload();
          }}
          disabled={isEnabled}
        >
          レシートの保存
        </PrimaryButton>
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

export default AddBudgetManagementModal;
