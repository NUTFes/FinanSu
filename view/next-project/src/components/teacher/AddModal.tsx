import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { post } from '@api/teachers';
import { PrimaryButton, Modal, Select, Input } from '@components/common';
import { DEPARTMENTS } from '@constants/departments';
import { Teacher } from '@type/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const OpenAddModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const initFormData: Teacher = {
    name: '',
    position: '',
    departmentID: 1,
    room: '',
    isBlack: false,
    remark: '',
  };

  const [formData, setFormData] = useState<Teacher>(initFormData);
  const [isBlack, setIsBlack] = useState<string>('false');

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const addTeacher = async (data: Teacher, isBlack: string) => {
    if (isBlack == 'true') {
      data.isBlack = true;
    } else {
      data.isBlack = false;
    }
    const addTeacherURL = process.env.CSR_API_URI + '/teachers';
    await post(addTeacherURL, data);
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='ml-auto w-fit'>
        <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
      </div>
      <div className='mx-auto w-fit text-xl'>教員の登録</div>
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
              checked={isBlack === 'true'}
              onChange={() => setIsBlack('true')}
            />
            <label htmlFor='black'>はい</label>
          </div>
          <div key='notBlack' className='flex items-center gap-3'>
            <input
              id='notBlack'
              type='radio'
              name='isBlack'
              value='false'
              checked={isBlack === 'false'}
              onChange={() => setIsBlack('false')}
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
            addTeacher(formData, isBlack);
            router.reload();
          }}
        >
          登録する
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default OpenAddModal;
