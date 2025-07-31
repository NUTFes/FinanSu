import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { multiDel } from '@api/api_methods';
import { Modal, CloseButton, OutlinePrimaryButton, PrimaryButton } from '@components/common';
import { User } from '@type/common';

export interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
  deleteUsers?: { users: User[]; ids: number[] };
}

const UsersDeleteModal: FC<ModalProps> = (props) => {
  const router = useRouter();

  const closeModal = () => {
    props.setShowModal(false);
  };

  const deleteUsers = async () => {
    const deleteUsersUrl = process.env.CSR_API_URI + '/users/delete';
    const res = await multiDel(deleteUsersUrl, props.deleteUsers?.ids || []);
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
    <Modal className='font-thin md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={() => props.setShowModal(false)} />
        </div>
      </div>
      <div className='mx-auto mb-5 w-fit text-xl  text-black-600'>ユーザーの削除</div>
      <div className='mx-auto my-5 w-fit text-xl'>下記のユーザーを削除してよろしいですか？</div>
      <div className='m-4 flex max-h-60 flex-col overflow-y-auto'>
        {props.deleteUsers?.users.map((user) => {
          return <p key={user.id}>{user.name}</p>;
        })}
      </div>
      <div className=''>
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton onClick={closeModal}>戻る</OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              deleteUsers();
              // closeModal();
            }}
          >
            削除
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default UsersDeleteModal;
