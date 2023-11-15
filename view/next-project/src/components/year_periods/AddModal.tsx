import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction, useState, useMemo } from 'react';
import { useRecoilState } from 'recoil';

import { Modal, CloseButton, Input, PrimaryButton } from '../common';
import { userAtom } from '@/store/atoms';
import { YearRecords } from '@/type/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const OpenAddModal: FC<ModalProps> = (props) => {
  const [user] = useRecoilState(userAtom);

  const router = useRouter();

  const [formData, setFormData] = useState<YearRecords>({
    id: 0,
    year: 0,
    startedAt: '',
    endedAt: '',
    createdAt: '',
    updatedAt: '',
  });

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  // const addFundInformation = async (data: FundInformation) => {
  //   const addFundInformationUrl = process.env.CSR_API_URI + '/fund_informations';
  //   await post(addFundInformationUrl, data);
  // };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <h1 className='mx-auto mb-10 w-fit text-xl text-black-600'>募金の登録</h1>
      <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
        <p className='col-span-2 text-black-600'>年度</p>
        <div className='col-span-3 w-full'>
          <Input className='w-full' onChange={handler('year')} placeholder='20XX' />
        </div>
        <p className='col-span-2 text-black-600'>開始日</p>
        <div className='col-span-3  w-full'>
          <Input type='date' onChange={handler('startedAt')} className='w-full' />
        </div>
        <p className='col-span-2 text-black-600'>終了日</p>
        <div className='col-span-3 w-full'>
          <Input type='date' onChange={handler('endedAt')} className='w-full' />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit'>
        <PrimaryButton
          className={'mx-2'}
          onClick={() => {
            // addFundInformation(formData);
            console.log(formData);
            props.setShowModal(false);
            // router.reload();
          }}
        >
          登録する
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default OpenAddModal;
