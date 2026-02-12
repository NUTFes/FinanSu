import React, { FC, useEffect, useMemo, useState } from 'react';

import { CloseButton, Modal, OutlinePrimaryButton, Select } from '@components/common';
import { Bureau, User } from '@type/common';
import { normalizePaidBy } from '@/utils/purchaseReportFilters';

interface PurchaseReportPaidByFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selection: {
    bureauId: number | null;
    paidByUserId: number | null;
    paidBy: string | null | undefined;
  }) => void;
  bureaus: Bureau[];
  users: User[];
  selectedBureauId: number | null;
  selectedPaidByUserId: number | null;
  selectedPaidBy: string | null | undefined;
}

const PurchaseReportPaidByFilterModal: FC<PurchaseReportPaidByFilterModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    onApply,
    bureaus,
    users,
    selectedBureauId,
    selectedPaidByUserId,
    selectedPaidBy,
  } = props;

  const [draftBureauId, setDraftBureauId] = useState<number | null>(selectedBureauId);
  const [draftPaidByUserId, setDraftPaidByUserId] = useState<number | null>(
    selectedPaidByUserId ?? null,
  );
  const [draftPaidBy, setDraftPaidBy] = useState<string | null>(normalizePaidBy(selectedPaidBy));

  useEffect(() => {
    if (!isOpen) return;
    setDraftBureauId(selectedBureauId);
    setDraftPaidByUserId(selectedPaidByUserId ?? null);
    setDraftPaidBy(normalizePaidBy(selectedPaidBy));
  }, [isOpen, selectedBureauId, selectedPaidBy, selectedPaidByUserId]);

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

  const legacyPaidBy = draftPaidByUserId == null ? draftPaidBy : null;
  const legacyPaidByValue = legacyPaidBy ? `legacy:${legacyPaidBy}` : '';
  const paidBySelectValue =
    draftPaidByUserId != null ? String(draftPaidByUserId) : legacyPaidByValue;

  const handleBureauChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const nextBureauId = value === '' ? null : Number(value);
    setDraftBureauId(nextBureauId);
    setDraftPaidByUserId(null);
    setDraftPaidBy(null);
  };

  const handlePaidByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === '') {
      setDraftPaidByUserId(null);
      setDraftPaidBy(null);
      return;
    }

    if (value.startsWith('legacy:')) {
      setDraftPaidByUserId(null);
      setDraftPaidBy(normalizePaidBy(value.replace('legacy:', '')));
      return;
    }

    const nextUserId = Number(value);
    if (!Number.isFinite(nextUserId) || nextUserId <= 0) {
      setDraftPaidByUserId(null);
      setDraftPaidBy(null);
      return;
    }

    const selectedUser = users.find((user) => user.id === nextUserId);
    setDraftPaidByUserId(nextUserId);
    setDraftPaidBy(normalizePaidBy(selectedUser?.name ?? null));
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
          <Select
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
          </Select>
        </div>
        <div>
          <p className={labelClassName}>氏名</p>
          <Select
            className={selectTextClassName}
            value={paidBySelectValue}
            onChange={handlePaidByChange}
          >
            <option className={optionClassName} value=''>
              絞り込みなし
            </option>
            {legacyPaidBy && (
              <option className={optionClassName} value={legacyPaidByValue}>
                {legacyPaidBy}
              </option>
            )}
            {filteredUsers.map((user) => {
              const bureauName = bureauNameMap.get(user.bureauID);
              const label = draftBureauId || !bureauName ? user.name : `${bureauName} ${user.name}`;
              return (
                <option className={optionClassName} key={user.id} value={user.id}>
                  {label}
                </option>
              );
            })}
          </Select>
        </div>
      </div>
      <div className='mt-6 flex justify-center'>
        <OutlinePrimaryButton onClick={handleApply}>絞り込む</OutlinePrimaryButton>
      </div>
    </Modal>
  );
};

export default PurchaseReportPaidByFilterModal;
