import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction, useState, useMemo } from 'react';
import { useRecoilState } from 'recoil';

import { Modal, CloseButton, Input, Select, PrimaryButton } from '../common';
import { userAtom } from '@/store/atoms';
import { post } from '@api/fundInformations';
import { BUREAUS } from '@constants/bureaus';
import { Department, FundInformation, Teacher, User } from '@type/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  teachers: Teacher[];
  departments: Department[];
  users: User[];
}

const OpenAddModal: FC<ModalProps> = (props) => {
  const [user] = useRecoilState(userAtom);

  const router = useRouter();
  const [departmentID, setDepartmentID] = useState<number | string>(1);

  const today = new Date();
  const yyyy = String(today.getFullYear());
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const ymd = `${yyyy}-${mm}-${dd}`;

  const [formData, setFormData] = useState<FundInformation>({
    userID: user.id,
    teacherID: props.teachers[0].id || 1,
    price: 0,
    remark: '',
    isFirstCheck: false,
    isLastCheck: false,
    receivedAt: ymd,
  });

  // 担当者を局でフィルタを適用
  const [bureauId, setBureauId] = useState<number>(1);
  const filteredUsers = useMemo(() => {
    const res = props.users
      .filter((user) => {
        return user.bureauID === bureauId;
      })
      .filter((user, index, self) => {
        return self.findIndex((u) => u.name === user.name) === index;
      });
    if (res.length !== 0) setFormData({ ...formData, userID: res[0].id });
    return res;
  }, [bureauId]);

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const handleDepartmentID = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentID(Number(e.target.value));
    const departmentTeachers = props.teachers.filter(
      (teacher) => teacher.departmentID === Number(e.target.value),
    );
    setFormData({ ...formData, teacherID: departmentTeachers[0].id || 0 });
  };

  const addFundInformation = async (data: FundInformation) => {
    const addFundInformationUrl = process.env.CSR_API_URI + '/fund_informations';
    await post(addFundInformationUrl, data);
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <h1 className='mx-auto mb-10 w-fit text-xl text-black-600'>募金の登録</h1>
      <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
        <p className='col-span-1 text-black-600'>教員の所属</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={departmentID} onChange={handleDepartmentID}>
            {props.departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </Select>
        </div>
        <p className='col-span-1 text-black-600'>教員名</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={formData.teacherID} onChange={handler('teacherID')}>
            {props.teachers
              .filter((teacher) => teacher.departmentID === departmentID)
              .map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
          </Select>
        </div>
        <p className='text-black-600'>担当者の局</p>
        <div className='col-span-4 w-full'>
          <Select value={bureauId} onChange={(e) => setBureauId(Number(e.target.value))}>
            {BUREAUS.map((bureaus) => (
              <option key={bureaus.id} value={bureaus.id}>
                {bureaus.name}
              </option>
            ))}
          </Select>
        </div>
        <p className='col-span-1 text-black-600'>担当者</p>
        <div className='col-span-4 w-full'>
          <Select className='w-full' value={formData.userID} onChange={handler('userID')}>
            {filteredUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </div>
        <p className='col-span-1 text-black-600'>受け取り日時</p>
        <div className='col-span-4 w-full'>
          <Input
            type='date'
            value={formData.receivedAt}
            onChange={handler('receivedAt')}
            className='w-full'
          />
        </div>
        <p className='col-span-1 text-black-600'>金額</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.price} onChange={handler('price')} />
        </div>
        <p className='col-span-1 text-black-600'>備考</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.remark} onChange={handler('remark')} />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit'>
        <PrimaryButton
          className={'mx-2'}
          onClick={() => {
            addFundInformation(formData);
            props.setShowModal(false);
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
