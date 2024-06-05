import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';

import { Teacher } from '@/type/common';
import { del } from '@api/teachers';
import { Modal, PrimaryButton, CloseButton, OutlinePrimaryButton } from '@components/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  deleteTeachers?: { teachers: Teacher[]; ids: number[] };
}

export default function DeleteModal(props: ModalProps) {
  const router = useRouter();

  const closeModal = () => {
    props.setShowModal(false);
    router.reload();
  };

  const deleteTeachers = async () => {
    const deleteURL = process.env.CSR_API_URI + '/teachers/delete';
    const res = await del(deleteURL, props.deleteTeachers?.ids || []);
    if (res === 200) {
      window.alert('削除しました');
      closeModal();
      router.reload();
    } else {
      window.alert('削除に失敗しました');
      closeModal();
    }
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit text-xl text-black-600'>教員データの削除</div>
      <div className='mx-auto my-5 w-fit text-xl'>下記の教員データを削除しますか？</div>
      <div className='m-4 flex max-h-60 flex-col overflow-y-auto'>
        {props.deleteTeachers?.teachers.map((teacher) => {
          return <p key={teacher.id}>{teacher.name}</p>;
        })}
      </div>
      <div className=''>
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton onClick={closeModal}>戻る</OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              deleteTeachers();
              closeModal();
            }}
          >
            削除
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
