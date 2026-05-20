import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { components as reactSelectComponents, DropdownIndicatorProps, StylesConfig } from 'react-select';

import { ROLES } from '@/constants/role';
import { useGetDivisions, useGetDivisionsUsers, useUpdateUserGroups } from '@/generated/hooks';
import { put } from '@api/user';
import { CloseButton, Input, Modal, MultiSelect, PrimaryButton, Select } from '@components/common';
import { Bureau, User } from '@type/common';

type DivisionOption = { value: string; label: string };

const divisionSelectStyles: StylesConfig<DivisionOption, true> = {
  control: (base, state) => ({
    ...base,
    borderRadius: '9999px',
    borderColor: '#56daff',
    boxShadow: state.isFocused ? '0 0 0 2px #56daff' : 'none',
    '&:hover': { borderColor: '#56daff' },
    padding: '0 0.5rem',
    minHeight: '2.5rem',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '0 0.75rem',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
};

const DivisionDropdownIndicator = (props: DropdownIndicatorProps<DivisionOption, true>) => (
  <reactSelectComponents.DropdownIndicator {...props}>
    <RiArrowDropDownLine size={24} color='#6b7280' />
  </reactSelectComponents.DropdownIndicator>
);

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  id: number | string;
  bureaus: Bureau[];
  user: User;
}

export default function UserEditModal(props: ModalProps) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const userId = Number(props.id);

  const [formData, setFormData] = useState<User>(props.user);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

  const { data: allDivisionsData } = useGetDivisions();
  const allDivisions = allDivisionsData?.data?.divisions ?? [];

  const { data: userDivisionsData } = useGetDivisionsUsers({ user_id: userId });

  const { trigger: triggerUpdateGroups } = useUpdateUserGroups(userId, currentYear);

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

  const divisionOptions = allDivisions
    .filter((d) => d.id !== undefined)
    .map((d) => ({ value: String(d.id), label: d.name ?? '' }));

  const selectedOptions = divisionOptions.filter((opt) =>
    selectedGroupIds.includes(Number(opt.value)),
  );

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
        <div className='col-span-4 w-full'>
          <MultiSelect
            options={divisionOptions}
            values={selectedOptions}
            onChange={(opts) => setSelectedGroupIds(opts.map((o) => Number(o.value)))}
            placeholder='部門を選択'
            customStyles={divisionSelectStyles}
            components={{ DropdownIndicator: DivisionDropdownIndicator }}
          />
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
