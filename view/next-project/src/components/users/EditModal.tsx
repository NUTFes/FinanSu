import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { BUREAUS } from '@/constants/bureaus';
import { ROLES } from '@/constants/role';
import {
  useGetDivisions,
  useGetDivisionsUsers,
  useGetYears,
  useUpdateUserGroups,
} from '@/generated/hooks';
import { put } from '@api/user';
import { CloseButton, Input, Modal, PrimaryButton, Select } from '@components/common';
import { Bureau, User } from '@type/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  id: number | string;
  bureaus: Bureau[];
  user: User;
}

export default function UserEditModal(props: ModalProps) {
  const router = useRouter();
  const userId = Number(props.id);

  const [formData, setFormData] = useState<User>(props.user);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

  const { data: yearsData } = useGetYears();
  const latestYear = useMemo(() => {
    const years = yearsData?.data ?? [];
    if (years.length === 0) return new Date().getFullYear();
    return Math.max(...years.map((y) => y.year));
  }, [yearsData]);

  const { data: allDivisionsData } = useGetDivisions();

  const { data: userDivisionsData } = useGetDivisionsUsers(
    { user_id: userId, year: latestYear },
    { swr: { enabled: !!yearsData } },
  );

  const { trigger: triggerUpdateGroups } = useUpdateUserGroups(userId, latestYear);

  useEffect(() => {
    const currentIds = userDivisionsData?.data?.map((d) => d.divisionId) ?? [];
    setSelectedGroupIds(currentIds);
  }, [userDivisionsData]);

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

  const divisionsByBureau = useMemo(() => {
    const divisions = allDivisionsData?.data?.divisions ?? [];
    const map = new Map<string, typeof divisions>();
    for (const division of divisions) {
      if (!division.financialRecord) continue;
      const list = map.get(division.financialRecord) ?? [];
      list.push(division);
      map.set(division.financialRecord, list);
    }
    const bureauOrder = new Map(BUREAUS.map((b, i) => [b.name, i]));
    return Array.from(map.entries()).sort(
      ([a], [b]) => (bureauOrder.get(a) ?? Infinity) - (bureauOrder.get(b) ?? Infinity),
    );
  }, [allDivisionsData]);

  const toggleDivision = (id: number) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAllInBureau = (bureauName: string) => {
    const ids = (divisionsByBureau.find(([name]) => name === bureauName)?.[1] ?? [])
      .filter((d) => d.id !== undefined)
      .map((d) => d.id as number);
    setSelectedGroupIds((prev) => {
      const allSelected = ids.every((id) => prev.includes(id));
      const others = prev.filter((id) => !ids.includes(id));
      return allSelected ? others : [...others, ...ids];
    });
  };

  const submitUser = async (data: User, id: number | string) => {
    const submitUserURL = process.env.CSR_API_URI + '/users/' + id;
    await put(submitUserURL, data);
    await triggerUpdateGroups({ groupIds: selectedGroupIds });
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
      <div className='text-black-600 mx-auto mb-10 w-fit text-xl'>ユーザの編集</div>
      <div className='text-black-600 grid grid-cols-5 place-items-center gap-4'>
        <p>氏名</p>
        <div className='col-span-4 w-full'>
          <Input className='w-full' value={formData.name} onChange={handler('name')} />
        </div>
        <p>局</p>
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
        <p>部門</p>
        <div className='col-span-4 flex w-full flex-col gap-2'>
          {divisionsByBureau.map(([bureauName, divisions]) => {
            const ids = divisions.filter((d) => d.id !== undefined).map((d) => d.id as number);
            const allSelected = ids.length > 0 && ids.every((id) => selectedGroupIds.includes(id));
            return (
              <div key={bureauName} className='border-primary-1 rounded-md border p-2'>
                <div className='mb-1 flex items-center justify-between'>
                  <span className='text-black-600 text-sm font-medium'>{bureauName}</span>
                  <button
                    type='button'
                    onClick={() => toggleAllInBureau(bureauName)}
                    className='text-primary-1 text-xs hover:underline'
                  >
                    {allSelected ? '全て解除' : '全て選択'}
                  </button>
                </div>
                <div className='flex flex-wrap gap-x-4 gap-y-1'>
                  {divisions.map((division) =>
                    division.id !== undefined ? (
                      <label key={division.id} className='flex cursor-pointer items-center gap-1'>
                        <input
                          type='checkbox'
                          checked={selectedGroupIds.includes(division.id)}
                          onChange={() => toggleDivision(division.id as number)}
                        />
                        <span className='text-black-600 text-sm'>{division.name}</span>
                      </label>
                    ) : null,
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className='mx-auto mt-10 w-fit'>
        <PrimaryButton
          onClick={async () => {
            await submitUser(formData, props.id);
            router.reload();
          }}
        >
          編集する
        </PrimaryButton>
      </div>
    </Modal>
  );
}
