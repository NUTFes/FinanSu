import React, { FC, useMemo, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

import { normalizePaidBy } from '@/utils/purchaseReportFilters';
import { CloseButton, Modal, OutlinePrimaryButton, Select } from '@components/common';
import s from './PurchaseReportPaidByFilterModal.module.css';
import { Bureau, User } from '@type/common';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isNameDropdownOpen, setIsNameDropdownOpen] = useState(false);

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

  const filteredOptions = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const legacy = legacyPaidByOptions
      .filter((name) => name.toLowerCase().includes(q))
      .map((name) => ({ label: name, userId: null as number | null, paidBy: name }));
    const userOpts = filteredUsers
      .filter((u) => {
        const bureauName = bureauNameMap.get(u.bureauID) ?? '';
        return `${bureauName} ${u.name}`.toLowerCase().includes(q);
      })
      .map((u) => {
        const bureauName = bureauNameMap.get(u.bureauID);
        return {
          label: draftBureauId || !bureauName ? u.name : `${bureauName} ${u.name}`,
          userId: u.id,
          paidBy: u.name,
        };
      });
    return [...legacy, ...userOpts];
  }, [searchQuery, filteredUsers, legacyPaidByOptions, bureauNameMap, draftBureauId]);

  const handleBureauChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const nextBureauId = value === '' ? null : Number(value);
    setDraftBureauId(nextBureauId);
    setDraftPaidByUserId(null);
    setDraftPaidBy(null);
    setSearchQuery('');
  };

  const handleSelectOption = (userId: number | null, paidBy: string | null) => {
    setDraftPaidByUserId(userId);
    setDraftPaidBy(normalizePaidBy(paidBy));
    setIsNameDropdownOpen(false);
  };

  const handleApply = () => {
    onApply({
      bureauId: draftBureauId ?? null,
      paidByUserId: draftPaidByUserId ?? null,
      paidBy: normalizePaidBy(draftPaidBy),
    });
  };

  const isSelected = (userId: number | null, paidBy: string) =>
    userId != null ? draftPaidByUserId === userId : draftPaidBy === paidBy;

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
          <div className={`${s.nameSelect} mb-2`}>
            <button
              type='button'
              className='w-full rounded-full border border-primary-1 py-2 pl-4 pr-8 text-left text-black-600 [font-family:"Noto_Sans_JP"]'
              onClick={() => setIsNameDropdownOpen((prev) => !prev)}
            >
              {draftPaidBy ?? '絞り込みなし'}
            </button>
          </div>
          {isNameDropdownOpen && (
            <div className='overflow-hidden rounded-2xl bg-black-300 shadow-lg'>
              <div className='px-3 pb-2 pt-3'>
                <div className='flex items-center gap-2 rounded-full border border-black-600 px-3 py-1.5'>
                  <RiSearchLine size={14} className='shrink-0 text-black-900' />
                  <input
                    type='text'
                    placeholder='Search'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full bg-black-300 text-sm text-white-0 outline-none placeholder:text-black-900 [font-family:"Noto_Sans_JP"]'
                  />
                </div>
              </div>
              <ul className='max-h-48 overflow-y-auto'>
                <li className='border-b border-black-600'>
                  <button
                    type='button'
                    className={`w-full px-4 py-2 text-left text-sm [font-family:"Noto_Sans_JP"] ${
                      draftPaidBy == null && draftPaidByUserId == null
                        ? 'bg-primary-5 text-white-0'
                        : 'text-white-0 hover:bg-black-600'
                    }`}
                    onClick={() => handleSelectOption(null, null)}
                  >
                    絞り込みなし
                  </button>
                </li>
                {filteredOptions.map((opt) => (
                  <li key={opt.userId != null ? `user:${opt.userId}` : `legacy:${opt.paidBy}`}>
                    <button
                      type='button'
                      className={`w-full px-4 py-2 text-left text-sm [font-family:"Noto_Sans_JP"] ${
                        isSelected(opt.userId, opt.paidBy)
                          ? 'bg-primary-5 text-white-0'
                          : 'text-white-0 hover:bg-black-600'
                      }`}
                      onClick={() => handleSelectOption(opt.userId, opt.paidBy)}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
                {filteredOptions.length === 0 && (
                  <li className='px-4 py-2 text-sm text-black-900 [font-family:"Noto_Sans_JP"]'>
                    該当なし
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className='mt-6 flex justify-center'>
        <OutlinePrimaryButton onClick={handleApply}>絞り込む</OutlinePrimaryButton>
      </div>
    </Modal>
  );
};

export default PurchaseReportPaidByFilterModal;
