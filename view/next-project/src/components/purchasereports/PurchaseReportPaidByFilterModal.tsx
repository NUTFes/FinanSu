import React, { FC, useMemo, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { normalizePaidBy } from '@/utils/purchaseReportFilters';
import { CloseButton, Modal, OutlinePrimaryButton, Select as CommonSelect } from '@components/common';
import { Bureau, User } from '@type/common';

type NameOption = { value: string; label: string };

interface PurchaseReportPaidByFilterModalProps {
  onClose: () => void;
  onApply: (selection: {
    bureauId: number | null;
    paidByUserId: number | null;
    paidBy: string | null | undefined;
  }) => void;
  bureaus: Bureau[];
  users: User[];
  legacyPaidByOptions: string[];
  selectedBureauId: number | null;
  selectedPaidByUserId: number | null;
  selectedPaidBy: string | null | undefined;
}

const PurchaseReportPaidByFilterModal: FC<PurchaseReportPaidByFilterModalProps> = (props) => {
  const {
    onClose,
    onApply,
    bureaus,
    users,
    legacyPaidByOptions,
    selectedBureauId,
    selectedPaidByUserId,
    selectedPaidBy,
  } = props;

  const [draftBureauId, setDraftBureauId] = useState<number | null>(selectedBureauId);
  const [draftPaidByUserId, setDraftPaidByUserId] = useState<number | null>(
    selectedPaidByUserId ?? null,
  );
  const [draftPaidBy, setDraftPaidBy] = useState<string | null>(normalizePaidBy(selectedPaidBy));

  const labelClassName = 'mb-2 text-sm text-black-600 [font-family:"Noto_Sans_JP"]';
  const selectTextClassName = 'text-black-600 [font-family:"Noto_Sans_JP"]';
  const optionClassName = 'text-black-600 [font-family:"Noto_Sans_JP"]';

  const bureauNameMap = useMemo(
    () =>
      new Map(
        bureaus.map((bureau) => [bureau.id ?? 0, bureau.name] as const).filter(([id]) => id > 0),
      ),
    [bureaus],
  );

  const filteredUsers = useMemo(() => {
    if (!draftBureauId) return users;
    return users.filter((user) => user.bureauID === draftBureauId);
  }, [draftBureauId, users]);

  const nameOptions = useMemo(
    (): NameOption[] => [
      { value: '', label: '絞り込みなし' },
      ...legacyPaidByOptions.map((name) => ({ value: `legacy:${name}`, label: name })),
      ...filteredUsers.map((u) => {
        const bureauName = bureauNameMap.get(u.bureauID);
        const label = draftBureauId || !bureauName ? u.name : `${bureauName} ${u.name}`;
        return { value: `user:${u.id}`, label };
      }),
    ],
    [filteredUsers, legacyPaidByOptions, bureauNameMap, draftBureauId],
  );

  const nameSelectValue =
    draftPaidByUserId != null
      ? (nameOptions.find((o) => o.value === `user:${draftPaidByUserId}`) ?? nameOptions[0])
      : draftPaidBy != null
        ? (nameOptions.find((o) => o.value === `legacy:${draftPaidBy}`) ?? nameOptions[0])
        : nameOptions[0];

  const handleBureauChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const nextBureauId = value === '' ? null : Number(value);
    setDraftBureauId(nextBureauId);
    setDraftPaidByUserId(null);
    setDraftPaidBy(null);
  };

  const handleNameChange = (option: SingleValue<NameOption>) => {
    const val = option?.value ?? '';
    if (val === '') {
      setDraftPaidByUserId(null);
      setDraftPaidBy(null);
    } else if (val.startsWith('user:')) {
      const id = Number(val.slice(5));
      setDraftPaidByUserId(id);
      setDraftPaidBy(users.find((u) => u.id === id)?.name ?? null);
    } else {
      setDraftPaidByUserId(null);
      setDraftPaidBy(val.slice(7));
    }
  };

  const handleApply = () => {
    onApply({
      bureauId: draftBureauId ?? null,
      paidByUserId: draftPaidByUserId ?? null,
      paidBy: normalizePaidBy(draftPaidBy),
    });
  };

  return (
    <Modal className='w-[90vw] max-w-[440px] p-6 shadow-lg' onClick={onClose}>
      <div className='flex justify-end'>
        <CloseButton onClick={onClose} />
      </div>
      <div className='mt-2 space-y-5'>
        <div>
          <p className={labelClassName}>局名</p>
          <CommonSelect
            className={selectTextClassName}
            value={draftBureauId ?? ''}
            onChange={handleBureauChange}
          >
            <option className={optionClassName} value=''>
              絞り込みなし
            </option>
            {bureaus.map((bureau) => (
              <option className={optionClassName} key={bureau.id ?? 0} value={bureau.id ?? 0}>
                {bureau.name}
              </option>
            ))}
          </CommonSelect>
        </div>
        <div>
          <p className={labelClassName}>氏名</p>
          <Select<NameOption>
            instanceId='paid-by-name-select'
            isSearchable
            options={nameOptions}
            value={nameSelectValue}
            onChange={handleNameChange}
            noOptionsMessage={() => '該当なし'}
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            styles={{
              control: (base, state) => ({
                ...base,
                borderRadius: '9999px',
                borderColor: state.isFocused ? '#48b2cf' : '#56DAFF',
                outline: state.isFocused ? '1.5px #48b2cf solid' : 'none',
                boxShadow: 'none',
                paddingTop: '0.25rem',
                paddingBottom: '0.25rem',
                paddingLeft: '0.75rem',
                paddingRight: '0.25rem',
                '&:hover': {
                  borderColor: state.isFocused ? '#48b2cf' : '#56DAFF',
                },
              }),
              indicatorSeparator: () => ({ display: 'none' }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>
      </div>
      <div className='mt-6 flex justify-center'>
        <OutlinePrimaryButton onClick={handleApply}>絞り込む</OutlinePrimaryButton>
      </div>
    </Modal>
  );
};

export default PurchaseReportPaidByFilterModal;
