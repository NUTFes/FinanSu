import { useRouter } from 'next/router';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { get } from '@api/api_methods';
import { put } from '@api/budget';
import { PrimaryButton, Input, Modal, Select } from '@components/common';
import { Budget, Source, Year } from '@type/common';

export interface BudgetProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  openModal: boolean;
  children?: React.ReactNode;
  id: number | string;
  sources: Source[];
  years: Year[];
}

const BudgetEditModal: FC<BudgetProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const [formData, setFormData] = useState<Budget>({
    yearID: 0,
    sourceID: 0,
    price: 0,
  });

  useEffect(() => {
    if (router.isReady) {
      const getFormDataUrl = process.env.CSR_API_URI + '/budgets/' + props.id;
      const getFormData = async (url: string) => {
        setFormData(await get(url));
      };
      getFormData(getFormDataUrl);
    }
  }, [router, props.id]);

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

  const submitBudget = async (data: Budget, id: number | string) => {
    const submitBudgetUrl = process.env.CSR_API_URI + '/budgets/' + id;
    await put(submitBudgetUrl, data);
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='ml-auto w-fit'>
        <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
      </div>
      <div className='mx-auto w-fit text-xl'>予算の編集</div>
      <div className='my-10 grid grid-cols-5 place-items-center gap-5 text-black-600'>
        <p>年度</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={formData.yearID} onChange={handler('yearID')}>
            {props.years.map((data) => (
              <option key={data.id} value={data.id}>
                {data.year}
              </option>
            ))}
          </Select>
        </div>
        <p>項目</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={formData.sourceID} onChange={handler('sourceID')}>
            {props.sources.map((source) => (
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
      <div className='mx-auto w-fit'>
        <PrimaryButton
          onClick={() => {
            submitBudget(formData, props.id);
            router.reload();
          }}
        >
          更新
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default BudgetEditModal;
