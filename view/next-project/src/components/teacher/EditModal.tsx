import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { put } from '@api/teachers';
import { PrimaryButton, Modal, Input, Select } from '@components/common';
import { DEPARTMENTS } from '@constants/departments';
import { Teacher } from '@type/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  id: number | string;
  teacher: Teacher;
}

export default function FundInformationEditModal(props: ModalProps) {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const [formData, setFormData] = useState<Teacher>(props.teacher);

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

  const update = async (data: Teacher, id: number | string) => {
    const updateTeacherURL = process.env.CSR_API_URI + '/teachers/' + id;
    await put(updateTeacherURL, data);
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='ml-auto w-fit'>
        <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
      </div>
      <div className='mx-auto w-fit text-xl'>教員情報の編集</div>
      <div className='my-10 grid grid-cols-5 items-center justify-items-center gap-5 text-black-600'>
        <p>教員名</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.name} onChange={handler('name')} />
        </div>
        <p>職位</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.position} onChange={handler('position')} />
        </div>
        <p>学科</p>
        <div className='col-span-4 w-full'>
          <Select
            className='w-full'
            value={formData.departmentID}
            onChange={handler('departmentID')}
          >
            {DEPARTMENTS.map((data) => (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            ))}
          </Select>
        </div>
        <p>居室</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.room} onChange={handler('room')} />
        </div>
        <p>ブラックリスト</p>
        <div className='col-span-4 flex justify-center gap-10'>
          <div key='black' className='flex items-center gap-3'>
            <input
              id='black'
              type='radio'
              name='isBlack'
              value='true'
              checked={formData.isBlack}
              onChange={() => setFormData({ ...formData, isBlack: true })}
            />
            <label htmlFor='black'>はい</label>
          </div>
          <div key='notBlack' className='flex items-center gap-3'>
            <input
              id='notBlack'
              type='radio'
              name='isBlack'
              value='false'
              checked={!formData.isBlack}
              onChange={() => setFormData({ ...formData, isBlack: false })}
            />
            <label htmlFor='notBlack'>いいえ</label>
          </div>
        </div>
        <p>備考</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.remark} onChange={handler('remark')} />
        </div>
      </div>
      <div className='mx-auto w-fit'>
        <PrimaryButton
          onClick={() => {
            update(formData, props.id);
            router.reload();
          }}
        >
          更新
        </PrimaryButton>
      </div>
    </Modal>
  );
}
