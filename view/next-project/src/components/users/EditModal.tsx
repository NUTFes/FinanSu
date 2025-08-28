import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';

import { Modal, PrimaryButton, CloseButton, Input, Select } from '../common';
import { ROLES } from '@/constants/role';
import { useGetUserGroupsUserUserId, usePostUserGroupsBulk, usePutUsersId } from '@/generated/hooks';
import { Bureau, User } from '@type/common';

interface Division {
  id: number;
  name: string;
}

interface UserWithDivisions extends User {
  divisions?: Division[];
}

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  id: number | string;
  bureaus: Bureau[];
  user: User;
  divisions: Division[];
}

export default function UserEditModal(props: ModalProps) {
  const router = useRouter();

  // ユーザーの部門情報を取得
  const {
    data: userGroupsData,
    isLoading: isLoadingUserGroups,
    error: userGroupsError,
  } = useGetUserGroupsUserUserId(Number(props.id));

  // ユーザー情報更新用のmutation
  const { trigger: updateUser } = usePutUsersId(Number(props.id), {
    name: '',
    bureau_id: 0,
    role_id: 0,
  });

  // 部門一括更新用のmutation
  const { trigger: updateUserGroups } = usePostUserGroupsBulk();

  const [formData, setFormData] = useState<UserWithDivisions>({
    ...props.user,
    divisions: [],
  });
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('');

  // ユーザーグループデータから部門情報を設定
  useEffect(() => {
    if (userGroupsData?.data) {
      const divisions = userGroupsData.data.map((userGroup) => ({
        id: userGroup.division?.id || 0,
        name: userGroup.division?.name || '',
      }));
      setFormData((prev) => ({ ...prev, divisions }));
    }
  }, [userGroupsData]);

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

  const handleAddDivision = () => {
    if (!selectedDivisionId) return;

    const divisionId = parseInt(selectedDivisionId);
    const division = props.divisions.find((d) => d.id === divisionId);

    if (!division) return;

    // 既に所属していないかチェック
    const isAlreadyAssigned = formData.divisions?.some((d) => d.id === divisionId);
    if (isAlreadyAssigned) return;

    setFormData({
      ...formData,
      divisions: [...(formData.divisions || []), division],
    });
    setSelectedDivisionId('');
  };

  const handleRemoveDivision = (divisionId: number) => {
    setFormData({
      ...formData,
      divisions: formData.divisions?.filter((d) => d.id !== divisionId) || [],
    });
  };

  const submitUser = async (data: UserWithDivisions, id: number | string) => {
    try {
      // ユーザー基本情報の更新
      await updateUser({
        name: data.name || '',
        bureau_id: data.bureauID || 0,
        role_id: data.roleID || 0,
      });

      // 部門の一括更新
      const groupIds = data.divisions?.map((division) => division.id) || [];
      await updateUserGroups({
        user_id: Number(id),
        group_ids: groupIds,
      });

      alert('ユーザーの部門を更新しました');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('ユーザーの更新に失敗しました');
    }
  };

  const availableDivisions = props.divisions.filter(
    (division) => !formData.divisions?.some((d) => d.id === division.id),
  );

  return (
    <Modal className='md:w-2/3'>
      <div className='ml-auto w-fit'>
        <CloseButton
          onClick={() => {
            props.setShowModal(false);
          }}
        />
      </div>
      <div className='mx-auto mb-10 w-fit text-xl text-black-600'>ユーザーの編集</div>
      <div className='mx-5'>
        <div className='mb-6 grid grid-cols-5 items-center justify-items-center gap-4 text-black-600'>
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

        {/* 部門管理セクション */}
        <div className='border-t pt-6'>
          <h3 className='mb-4 text-lg font-medium text-black-600'>所属部門管理</h3>

          {/* 現在の所属部門 */}
          <div className='mb-6'>
            <p className='mb-2 text-sm text-black-600'>現在の所属部門:</p>
            <div className='border-gray-300 bg-gray-50 min-h-[100px] rounded border p-3'>
              {formData.divisions && formData.divisions.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {formData.divisions.map((division) => (
                    <div
                      key={division.id}
                      className='bg-blue-100 text-blue-800 flex items-center rounded-full px-3 py-1 text-sm'
                    >
                      <span>{division.name}</span>
                      <button
                        type='button'
                        onClick={() => handleRemoveDivision(division.id)}
                        className='text-blue-600 hover:text-blue-800 ml-2 font-bold'
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 py-8 text-center'>部門に所属していません</p>
              )}
            </div>
          </div>

          {/* 部門追加 */}
          <div className='mb-6'>
            <p className='mb-2 text-sm text-black-600'>部門を追加:</p>
            <div className='flex gap-2'>
              <Select
                value={selectedDivisionId}
                onChange={(e) => setSelectedDivisionId(e.target.value)}
                className='flex-1'
              >
                <option value=''>部門を選択してください</option>
                {availableDivisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.name}
                  </option>
                ))}
              </Select>
              <button
                type='button'
                onClick={handleAddDivision}
                disabled={!selectedDivisionId}
                className='bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 rounded px-4 py-2 disabled:cursor-not-allowed'
              >
                追加
              </button>
            </div>
            {availableDivisions.length === 0 && (
              <p className='text-gray-500 mt-1 text-sm'>すべての部門に所属しています</p>
            )}
          </div>
        </div>

        <div className='mx-auto mt-10 w-fit'>
          <PrimaryButton
            onClick={() => {
              submitUser(formData, props.id);
              router.reload();
            }}
          >
            更新する
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
