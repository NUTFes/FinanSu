import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { Modal, PrimaryButton, CloseButton, Input, Select } from '../common';
import { ROLES } from '@/constants/role';
import { put } from '@api/user';
import { Bureau, User } from '@type/common';

export interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  id: number | string;
  bureaus: Bureau[];
  user: User;
}

export default function FundInformationEditModal(props: ModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<User>(props.user);

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

  const submitUser = async (data: User, id: number | string) => {
    const submitUserURL = process.env.CSR_API_URI + '/users/' + id;
    console.log(data);
    await put(submitUserURL, data);
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='ml-auto w-fit'>
        <CloseButton
          onClick={() => {
            props.setShowModal(false);
          }}
        />
      </div>
      <div className='mx-auto mb-10 w-fit text-xl text-black-600'>ユーザの編集</div>
      <div className='grid grid-cols-5 items-center justify-items-center gap-4 text-black-600'>
        <p>氏名</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.name} onChange={handler('name')} />
        </div>
        <p>学科</p>
        <div className='col-span-4 w-full'>
          <Select value={formData.bureauID} onChange={handler('bureauID')}>
            {props.bureaus.map((data) => (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            ))}
          </Select>
        </div>
        <p>権限</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={formData.roleID} onChange={handler('roleID')}>
            {ROLES.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className='mx-auto mt-10 w-fit'>
        <PrimaryButton
          onClick={() => {
            submitUser(formData, props.id);
            router.reload();
          }}
        >
          編集する
        </PrimaryButton>
      </div>
    </Modal>
  );
}
