import { format } from 'date-fns';
import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { useRecoilState } from 'recoil';

import { Modal, CloseButton, Input, PrimaryButton } from '../common';
import { userAtom } from '@/store/atoms';
import { YearPeriod } from '@/type/common';
import { post } from '@/utils/api/api_methods';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  yearPeriods?: YearPeriod[];
}

const OpenAddModal: FC<ModalProps> = (props) => {
  const [user] = useRecoilState(userAtom);
  const [flashMessage, setFlashMessage] = useState<string>('');

  const router = useRouter();

  const [formData, setFormData] = useState<YearPeriod>({
    year: 0,
    startedAt: '',
    endedAt: '',
  });

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const submit = async (data: YearPeriod) => {
    const startedAt = data.startedAt && new Date(data.startedAt);
    const endedAt = data.endedAt && new Date(data.endedAt);
    const formattedStartedAt = startedAt && format(startedAt, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const formattedEndedAt = endedAt && format(endedAt, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const submitData = {
      ...data,
      year: Number(data.year),
      startedAt: formattedStartedAt,
      endedAt: formattedEndedAt,
    };
    props.yearPeriods
      ? props.yearPeriods.some((yearPeriod) => yearPeriod.year === Number(formData.year))
        ? setFlashMessage('既に年度が登録されています')
        : await addYearPeriod(submitData)
      : await addYearPeriod(submitData);
  };

  const addYearPeriod = async (data: YearPeriod) => {
    const addPeriodUrl = process.env.CSR_API_URI + '/years/periods';
    await post(addPeriodUrl, data);
    props.setShowModal(false);
    router.reload();
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <h1 className='mx-auto mb-10 w-fit text-xl text-black-600'>年度の登録</h1>
      <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
        <p className='col-span-2 text-black-600'>年度</p>
        <div className='col-span-3 h-12 w-full'>
          <Input className='w-full' onChange={handler('year')} placeholder='20XX' type='number' />
          <p className='text-xs text-red-500'>{flashMessage}</p>
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
            submit(formData);
          }}
          disabled={
            String(formData.year) === '' || formData.startedAt === '' || formData.endedAt === ''
          }
        >
          登録する
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default OpenAddModal;
