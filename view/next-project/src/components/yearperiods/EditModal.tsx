import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';

import { Modal, Input, CloseButton, PrimaryButton } from '../common';
import { put } from '@api/api_methods';
import { YearPeriod } from '@type/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  yearPeriod: YearPeriod;
}

export default function EditModal(props: ModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<YearPeriod>({
    id: props.yearPeriod.id,
    year: props.yearPeriod.year,
    startedAt: props.yearPeriod.startedAt,
    endedAt: props.yearPeriod.endedAt,
  });

  const handler =
    (input: string) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
    ) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const submitYearRecords = async (data: YearPeriod) => {
    const submitYearRecordsURL = process.env.CSR_API_URI + '/years/periods/' + data.id;
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
    console.log(data);
    console.log(submitData);
    await put(submitYearRecordsURL, submitData);
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <h1 className='mx-auto mb-10 w-fit text-xl text-black-600'>年度の編集</h1>
      <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
        <p className='col-span-1 text-black-600'>年度</p>
        <div className='col-span-4 w-full'>
          <Input
            className='w-full'
            onChange={handler('year')}
            value={formData.year}
            type='number'
          />
        </div>
        <p className='col-span-1 text-black-600'>開始日</p>
        <div className='col-span-4 w-full'>
          <Input
            type='date'
            onChange={handler('startedAt')}
            className='w-full'
            value={formData.startedAt && format(new Date(formData.startedAt), 'yyyy-MM-dd')}
          />
        </div>
        <p className='text-black-600'>終了日</p>
        <div className='col-span-4 w-full'>
          <Input
            type='date'
            onChange={handler('endedAt')}
            className='w-full'
            value={formData.endedAt && format(new Date(formData.endedAt), 'yyyy-MM-dd')}
          />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit'>
        <PrimaryButton
          className={'mx-2'}
          onClick={() => {
            submitYearRecords(formData);
            props.setShowModal(false);
            router.reload();
          }}
        >
          登録する
        </PrimaryButton>
      </div>
    </Modal>
  );
}
