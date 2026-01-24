import React, { FC, useEffect, useMemo, useState } from 'react';

import { CloseButton, Modal, OutlinePrimaryButton, Select } from '@components/common';
import { Bureau, User } from '@type/common';

interface PurchaseReportPaidByFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selection: {
    bureauId: number | null;
    paidByUserId: number | null | undefined;
  }) => void;
  bureaus: Bureau[];
  users: User[];
  selectedBureauId: number | null;
  selectedPaidByUserId: number | null | undefined;
}

const PurchaseReportPaidByFilterModal: FC<PurchaseReportPaidByFilterModalProps> = (props) => {
  const { isOpen, onClose, onApply, bureaus, users, selectedBureauId, selectedPaidByUserId } =
    props;

  const [draftBureauId, setDraftBureauId] = useState<number | null>(selectedBureauId);
  const [draftPaidByUserId, setDraftPaidByUserId] = useState<number | null | undefined>(
    selectedPaidByUserId,
  );

  useEffect(() => {
    if (!isOpen) return;
    setDraftBureauId(selectedBureauId);
    setDraftPaidByUserId(selectedPaidByUserId);
  }, [isOpen, selectedBureauId, selectedPaidByUserId]);

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

  const paidBySelectValue = draftPaidByUserId === null ? 'none' : draftPaidByUserId ?? '';

  const handleBureauChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const nextBureauId = value === '' ? null : Number(value);
    setDraftBureauId(nextBureauId);
    setDraftPaidByUserId(undefined);
  };

  const handlePaidByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === '') {
      setDraftPaidByUserId(undefined);
      return;
    }
    if (value === 'none') {
      setDraftPaidByUserId(null);
      return;
    }
    setDraftPaidByUserId(Number(value));
  };

  const handleApply = () => {
    onApply({
      bureauId: draftBureauId ?? null,
      paidByUserId: draftPaidByUserId,
    });
  };

  return (
    <Modal className='w-[90vw] max-w-[440px] p-6 shadow-lg' onClick={onClose}>
      <div className='flex justify-end'>
        <CloseButton onClick={onClose} />
      </div>
      <div className='mt-2 space-y-5'>
        <div>
          <p className='mb-2 text-sm text-black-600'>局名</p>
          <Select value={draftBureauId ?? ''} onChange={handleBureauChange}>
            <option value=''>絞り込みなし</option>
            {bureaus.map((bureau) => (
              <option key={bureau.id ?? 0} value={bureau.id ?? 0}>
                {bureau.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <p className='mb-2 text-sm text-black-600'>氏名</p>
          <Select value={paidBySelectValue} onChange={handlePaidByChange}>
            <option value='none'>絞り込みなし</option>
            {filteredUsers.map((user) => {
              const bureauName = bureauNameMap.get(user.bureauID);
              const label = draftBureauId || !bureauName ? user.name : `${bureauName} ${user.name}`;
              return (
                <option key={user.id} value={user.id}>
                  {label}
                </option>
              );
            })}
          </Select>
          {/* NOTE: paid_by_user_id の NULL を絞り込む仕様が未定義のため「立替者なし」は未実装。 */}
        </div>
      </div>
      <div className='mt-6 flex justify-center'>
        <OutlinePrimaryButton onClick={handleApply}>絞り込む</OutlinePrimaryButton>
      </div>
    </Modal>
  );
};

export default PurchaseReportPaidByFilterModal;
