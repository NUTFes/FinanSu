import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState, useMemo } from 'react';

import { Modal, Input, Select, CloseButton, PrimaryButton } from '../common';
import { put } from '@api/fundInformations';
import { BUREAUS } from '@constants/bureaus';
import { FundInformation, Teacher, User, Department } from '@type/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  teachers: Teacher[];
  users: User[];
  departments: Department[];
  fundInformation: FundInformation;
}

export default function EditModal(props: ModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<FundInformation>({
    id: props.fundInformation.id,
    userID: props.fundInformation.userID,
    teacherID: props.fundInformation.teacherID,
    price: props.fundInformation.price,
    remark: props.fundInformation.remark,
    isFirstCheck: false,
    isLastCheck: false,
  });

  const [departmentID, setDepartmentID] = useState<number | string>(1);

  useEffect(() => {
    const teacher = props.teachers.find((teacher) => teacher.departmentID === departmentID);
    if (teacher && teacher.id) {
      setFormData({ ...formData, teacherID: teacher.id });
    }
  }, [departmentID]);

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

  const submitFundInformation = async (data: FundInformation) => {
    const submitFundInformationURL = process.env.CSR_API_URI + '/fund_informations/' + data.id;
    await put(submitFundInformationURL, data);
    router.reload();
  };

  // 担当者を局でフィルタを適用
  const [bureauId, setBureauId] = useState<number>(
    BUREAUS.find((b) => {
      return (
        b.id ===
        props.users.find((u) => {
          return u.id === props.fundInformation.userID;
        })?.bureauID
      );
    })?.id ?? 1,
  );
  const filteredUsers = useMemo(() => {
    const res = props.users
      .filter((user) => {
        return user.bureauID === bureauId;
      })
      .filter((user, index, self) => {
        return self.findIndex((u) => u.name === user.name) === index;
      });
    return res;
  }, [bureauId]);

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <h1 className='mx-auto mb-10 w-fit text-xl text-black-600'>募金の登録</h1>
      <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
        <p className='col-span-1 text-black-600'>所属</p>
        <div className='col-span-4 w-full'>
          <Select
            className='w-full'
            value={departmentID}
            onChange={(e) => {
              setDepartmentID(Number(e.target.value));
            }}
          >
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
        <p className='text-black-600'>所属している局</p>
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
            submitFundInformation(formData);
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
