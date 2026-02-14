import { useRouter } from 'next/router';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { post } from '@api/budget';
import RegistButton from '@components/common/RegistButton';
import { Budget, Source, Year } from '@type/common';

import Input from './Input/Input';
import Modal from './Modal';
import Select from './Select/Select';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  openModal: boolean;
}

const RegistModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const [formData, setFormData] = useState<Budget>({
    price: 0,
    yearID: 1,
    sourceID: 1,
  });

  const sourceList: Source[] = [
    {
      id: 1,
      name: '教育振興会費',
    },
    {
      id: 2,
      name: '同窓会費',
    },
    {
      id: 3,
      name: '企業協賛金',
    },
    {
      id: 4,
      name: '学内募金',
    },
  ];

  const yearList: Year[] = [
    {
      id: 1,
      year: 2020,
    },
    {
      id: 2,
      year: 2021,
    },
    {
      id: 3,
      year: 2022,
    },
    {
      id: 4,
      year: 2023,
    },
  ];

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

  if (!props.openModal) {
    return null;
  }

  return (
    <Modal onClick={closeModal} className='w-full max-w-md'>
      <div className='p-3'>
        <div className='mt-5 flex justify-end'>
          <div className='
            mr-5 cursor-pointer rounded-sm
            hover:bg-primary-3
          ' onClick={closeModal}>
            <RiCloseCircleLine size={'23px'} color={'gray'} />
          </div>
        </div>
        <div className='flex flex-col items-center gap-8'>
          <p className='text-xl text-black-600'>予算の登録</p>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center'>
              <span className='mr-3 text-black-600'>年度</span>
              <Select value={formData.yearID} onChange={handler('yearID')} className='
                w-56
              '>
                {yearList.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.year}
                  </option>
                ))}
              </Select>
            </div>
            <div className='flex items-center'>
              <span className='mr-3 text-black-600'>項目</span>
              <Select value={formData.sourceID} onChange={handler('sourceID')} className='
                w-56
              '>
                {sourceList.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className='flex items-center'>
              <span className='mr-3 text-black-600'>金額</span>
              <Input
                className='w-24 px-4 py-2'
                value={formData.price}
                onChange={handler('price')}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='mt-5 mb-10 flex justify-center'>
        <RegistButton
          width='220px'
          onClick={() => {
            registBudget(formData);
            router.reload();
          }}
        >
          登録する
        </RegistButton>
      </div>
    </Modal>
  );
};

export default RegistModal;
