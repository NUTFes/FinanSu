import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState, useMemo } from 'react';

import { Modal, Input, Select, CloseButton, PrimaryButton } from '../common';
import { get } from '@api/api_methods';
import { put } from '@api/fundInformations';
import { BUREAUS } from '@constants/bureaus';
import { DONATION_AMOUNT } from '@constants/donationAmount';
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

  const { teachers, fundInformation } = props;

  const [formData, setFormData] = useState<FundInformation>({
    id: fundInformation.id,
    userID: fundInformation.userID,
    teacherID: fundInformation.teacherID,
    price: fundInformation.price,
    remark: fundInformation.remark,
    isFirstCheck: false,
    isLastCheck: false,
    receivedAt: fundInformation.receivedAt,
  });

  const defaultTeacher = teachers.find((teacher) => teacher.id === props.fundInformation.teacherID);
  const [teacher, setTeacher] = useState<Teacher | undefined>(defaultTeacher);
  const [departmentID, setDepartmentID] = useState<number>(defaultTeacher?.departmentID || 1);

  const [registeredTeacherIds, setRegisteredTeacherIds] = useState<number[]>([]);

  const isRegisteredTeacherWithoutEditID = (id: number) => {
    return registeredTeacherIds.includes(id) && fundInformation.teacherID !== id;
  };

  useEffect(() => {
    if (teacher?.departmentID !== departmentID) {
      const relatedTeachers = teachers.filter((teacher) => teacher.departmentID === departmentID);
      const firstNotRegisteredTeacher = relatedTeachers.find((teacher) => {
        return (
          !registeredTeacherIds.includes(teacher?.id || 0) ||
          fundInformation.teacherID === teacher.id
        );
      });
      relatedTeachers &&
        setFormData({
          ...formData,
          teacherID: firstNotRegisteredTeacher?.id || 0,
        });
      setTeacher(firstNotRegisteredTeacher);
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
  const [bureauId, setBureauId] = useState<number | undefined>(
    props.users.find((user) => {
      return user.id === props.fundInformation.userID;
    })?.bureauID || undefined,
  );

  // 募金に登録されているuser情報
  const default_user = props.users.find((user) => user.id === formData.userID);

  const filteredUsers = useMemo(() => {
    const res = props.users
      .filter((user) => {
        return user.bureauID === bureauId;
      })
      .filter((user, index, self) => {
        return self.findIndex((u) => u.name === user.name) === index;
      });
    if (res.length !== 0 && default_user?.bureauID !== bureauId)
      setFormData({ ...formData, userID: res[0].id });
    return res;
  }, [bureauId]);

  async function getRegisteredTeachers() {
    const registeredTeachersURL = process.env.CSR_API_URI + '/teachers/fundRegistered/2024';
    const resData = await get(registeredTeachersURL);
    setRegisteredTeacherIds(resData);
  }

  useEffect(() => {
    getRegisteredTeachers();
  }, []);

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
            {teachers
              .filter((teacher) => teacher.departmentID === departmentID)
              .map((teacher) => (
                <option
                  key={teacher.id}
                  value={teacher.id}
                  disabled={isRegisteredTeacherWithoutEditID(teacher?.id || 0)}
                >
                  {teacher.name}
                  {isRegisteredTeacherWithoutEditID(teacher?.id || 0) && '(募金登録済)'}
                </option>
              ))}
          </Select>
        </div>
        <p className='text-black-600'>担当者の局</p>
        <div className='col-span-4 w-full'>
          <Select value={bureauId} onChange={(e) => setBureauId(Number(e.target.value))}>
            {!bureauId && (
              <option disabled selected>
                局が登録されていません
              </option>
            )}
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
        <p className='cols-span-1 text-black-600'>受け取り日時</p>
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
          <Input
            className='w-full'
            value={formData.price}
            onChange={handler('price')}
            datalist={{
              key: 'amoutOptions',
              data: DONATION_AMOUNT,
            }}
          />
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
