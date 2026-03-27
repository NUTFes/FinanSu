import { FC, useMemo, useState } from 'react';

import { FeasibilityStatus } from '@/generated/model';
import { SORT_OPTIONS, SponsorActivitiesFilterType } from '@/utils/sponsorshipActivity';
import { CloseButton, Modal, PrimaryButton, SearchSelect, Select, Title } from '@components/common';
import { BUREAUS } from '@constants/bureaus';
import { Sponsor, SponsorStyle, User } from '@type/common';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
  sponsorStyles: SponsorStyle[];
  users: User[];
  sponsors: Sponsor[];
  filterData: SponsorActivitiesFilterType;
  setFilterData: (filterData: SponsorActivitiesFilterType) => void;
}

const SELECT = '選択中';
const NOT_SELECT = '未選択';

interface StyleSelectionSectionProps {
  styleOptions: (SponsorStyle & { id: number })[];
  selectedStyleIds: number[];
  isAllStyleCheck: boolean;
  onToggleAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleStyle: (id: number) => void;
}

const StyleSelectionSection: FC<StyleSelectionSectionProps> = ({
  styleOptions,
  selectedStyleIds,
  isAllStyleCheck,
  onToggleAll,
  onToggleStyle,
}) => {
  const selectedStyleIdSet = useMemo(() => new Set(selectedStyleIds), [selectedStyleIds]);

  return (
    <>
      <p>協賛スタイル</p>
      <div className='w-full'>
        <div>
          <div
            className='
              flex rounded-md p-2
              hover:bg-white-100
            '
          >
            <input type='checkbox' onChange={onToggleAll} checked={isAllStyleCheck} id='all' />
            <label htmlFor='all' className='mx-2 w-full text-black-300'>
              すべて （{selectedStyleIds.length > 0 ? SELECT + selectedStyleIds.length : NOT_SELECT}
              ）
            </label>
          </div>
          <div className='
            max-h-28 overflow-y-auto rounded-md border-2 bg-white-0
          '>
            {styleOptions.map((style) => (
              <div
                className='
                  flex p-2
                  hover:bg-white-100
                '
                key={style.id}
              >
                <input
                  type='checkbox'
                  checked={selectedStyleIdSet.has(style.id)}
                  onChange={() => {
                    onToggleStyle(style.id);
                  }}
                  id={String(style.id)}
                />
                <label htmlFor={String(style.id)} className='
                  mx-2 w-full text-black-300
                '>
                  {style.style}/{style.feature}/{style.price}円
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

interface BasicFilterSectionProps {
  bureauSelectOptions: { value: string; label: string }[];
  selectedBureauOption: { value: string; label: string } | null;
  userSelectOptions: { value: string; label: string }[];
  selectedUserOption: { value: string; label: string } | null;
  sponsorSelectOptions: { value: string; label: string }[];
  selectedSponsorOption: { value: string; label: string } | null;
  draftFilterData: SponsorActivitiesFilterType;
  onBureauChange: (selected: { value: string; label: string } | null) => void;
  onUserChange: (selected: { value: string; label: string } | null) => void;
  onSponsorChange: (selected: { value: string; label: string } | null) => void;
  onFeasibilityChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const BasicFilterSection: FC<BasicFilterSectionProps> = ({
  bureauSelectOptions,
  selectedBureauOption,
  userSelectOptions,
  selectedUserOption,
  sponsorSelectOptions,
  selectedSponsorOption,
  draftFilterData,
  onBureauChange,
  onUserChange,
  onSponsorChange,
  onFeasibilityChange,
  onSortChange,
}) => (
  <>
    <p>所属局</p>
    <div className='w-full'>
      <SearchSelect
        options={bureauSelectOptions}
        value={selectedBureauOption}
        placeholder='所属局で検索'
        noOptionMessage='該当する所属局がありません'
        onChange={onBureauChange}
      />
    </div>
    <p>担当者</p>
    <div className='w-full'>
      <SearchSelect
        options={userSelectOptions}
        value={selectedUserOption}
        placeholder='担当者で検索'
        noOptionMessage='該当する担当者がありません'
        onChange={onUserChange}
      />
    </div>
    <p>企業名</p>
    <div className='w-full'>
      <SearchSelect
        options={sponsorSelectOptions}
        value={selectedSponsorOption}
        placeholder='企業名で検索'
        noOptionMessage='該当する企業がありません'
        onChange={onSponsorChange}
      />
    </div>
    <p>協賛可否</p>
    <div className='w-full'>
      <Select
        value={draftFilterData.feasibilityStatus}
        onChange={(e) => onFeasibilityChange(e.target.value)}
      >
        <option value='all'>すべて</option>
        <option value={FeasibilityStatus.possible}>可</option>
        <option value={FeasibilityStatus.impossible}>否</option>
        <option value={FeasibilityStatus.unstarted}>未定</option>
      </Select>
    </div>
    <p>並び替え</p>
    <div className='w-full'>
      <Select
        className='w-full'
        value={draftFilterData.selectedSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {SORT_OPTIONS.map((sortOption) => (
          <option key={sortOption.value} value={sortOption.value}>
            {sortOption.label}
          </option>
        ))}
      </Select>
    </div>
  </>
);

const FilterModal: FC<ModalProps> = (props) => {
  const { sponsorStyles, users, sponsors, filterData, setFilterData } = props;

  const styleOptions = useMemo(
    () =>
      sponsorStyles.filter(
        (style): style is SponsorStyle & { id: number } => style.id !== undefined,
      ),
    [sponsorStyles],
  );
  const sponsorOptions = useMemo(
    () =>
      sponsors.filter((sponsor): sponsor is Sponsor & { id: number } => sponsor.id !== undefined),
    [sponsors],
  );

  // モーダル用の変数
  const [draftFilterData, setDraftFilterData] = useState<SponsorActivitiesFilterType>(filterData);

  const isAllStyleCheck =
    styleOptions.length > 0 && draftFilterData.styleIds.length === styleOptions.length;

  const filteredUsers = useMemo(() => {
    if (draftFilterData.bureauId === 'all') return users;
    return users.filter((user) => user.bureauID === draftFilterData.bureauId);
  }, [users, draftFilterData.bureauId]);

  const bureauSelectOptions = useMemo(
    () => [
      { value: 'all', label: '所属局で検索' },
      ...BUREAUS.map((bureau) => ({
        value: String(bureau.id),
        label: bureau.name,
      })),
    ],
    [],
  );

  const userSelectOptions = useMemo(
    () => [
      { value: 'all', label: '担当者で検索' },
      ...filteredUsers.map((user) => ({
        value: String(user.id),
        label: user.name,
      })),
    ],
    [filteredUsers],
  );

  const sponsorSelectOptions = useMemo(
    () => [
      { value: 'all', label: '企業名で検索' },
      ...sponsorOptions.map((sponsor) => ({
        value: String(sponsor.id),
        label: sponsor.name,
      })),
    ],
    [sponsorOptions],
  );

  const selectedBureauOption = useMemo(
    () =>
      draftFilterData.bureauId === 'all'
        ? null
        : bureauSelectOptions.find((option) => option.value === String(draftFilterData.bureauId)) ||
          null,
    [bureauSelectOptions, draftFilterData.bureauId],
  );

  const selectedUserOption = useMemo(
    () =>
      draftFilterData.userId === 'all'
        ? null
        : userSelectOptions.find((option) => option.value === String(draftFilterData.userId)) ||
          null,
    [userSelectOptions, draftFilterData.userId],
  );

  const selectedSponsorOption = useMemo(
    () =>
      draftFilterData.sponsorId === 'all'
        ? null
        : sponsorSelectOptions.find(
            (option) => option.value === String(draftFilterData.sponsorId),
          ) || null,
    [sponsorSelectOptions, draftFilterData.sponsorId],
  );

  function filterHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const availableStyleIdSet = new Set(styleOptions.map((style) => style.id));
    setFilterData({
      ...draftFilterData,
      styleIds: draftFilterData.styleIds.filter((styleId) => availableStyleIdSet.has(styleId)),
    });
    props.setIsOpen(false);
  }

  function addAndRemoveStyleIds(id: number) {
    setDraftFilterData((prev) => {
      const hasStyle = prev.styleIds.includes(id);

      if (hasStyle) {
        return {
          ...prev,
          styleIds: prev.styleIds.filter((styleId) => styleId !== id),
        };
      }

      return {
        ...prev,
        styleIds: [...prev.styleIds, id],
      };
    });
  }

  const topCheckboxEvent = (_event: React.ChangeEvent<HTMLInputElement>) => {
    isAllStyleCheck ? deleteAllStyleIds() : addAllStyleIds();
  };

  const preventCloseModalClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const preventCloseModalKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
  };

  function addAllStyleIds() {
    const allStyleIDs = styleOptions.map((style) => style.id);
    setDraftFilterData((prev) => ({ ...prev, styleIds: allStyleIDs }));
  }

  function deleteAllStyleIds() {
    setDraftFilterData((prev) => ({ ...prev, styleIds: [] }));
  }

  const onClose = () => {
    props.setIsOpen(false);
  };

  return (
    <Modal className='w-full max-w-2xl px-15 py-12.5' onClick={onClose}>
      <form onSubmit={filterHandler}>
        <div
          onClick={preventCloseModalClick}
          onKeyDown={preventCloseModalKeyDown}
          role='presentation'
        >
          <div className='w-full'>
            <div className='ml-auto w-fit'>
              <CloseButton onClick={onClose} />
            </div>
          </div>
          <div className='mx-auto mb-5 flex w-fit flex-col gap-2.5 text-center'>
            <Title title='協賛フィルター' className='text-3xl' />
            <p className='text-sm text-black-300'>条件を指定して表示内容を絞り込めます</p>
          </div>
          <div
            className='
              mx-auto mb-8 grid w-full grid-cols-[7rem_minmax(0,1fr)]
              items-center gap-5
              [&>p]:text-center [&>p]:whitespace-nowrap [&>p]:text-black-600
            '
          >
            <StyleSelectionSection
              styleOptions={styleOptions}
              selectedStyleIds={draftFilterData.styleIds}
              isAllStyleCheck={isAllStyleCheck}
              onToggleAll={topCheckboxEvent}
              onToggleStyle={addAndRemoveStyleIds}
            />
            <BasicFilterSection
              bureauSelectOptions={bureauSelectOptions}
              selectedBureauOption={selectedBureauOption}
              userSelectOptions={userSelectOptions}
              selectedUserOption={selectedUserOption}
              sponsorSelectOptions={sponsorSelectOptions}
              selectedSponsorOption={selectedSponsorOption}
              draftFilterData={draftFilterData}
              onBureauChange={(selected) => {
                if (!selected) return;
                const bureauIdValue = selected.value === 'all' ? 'all' : Number(selected.value);
                const nextUsers =
                  bureauIdValue === 'all'
                    ? users
                    : users.filter((user) => user.bureauID === bureauIdValue);
                setDraftFilterData((prev) => ({
                  ...prev,
                  bureauId: bureauIdValue,
                  userId:
                    prev.userId !== 'all' && !nextUsers.some((user) => user.id === prev.userId)
                      ? 'all'
                      : prev.userId,
                }));
              }}
              onUserChange={(selected) => {
                if (!selected) return;
                setDraftFilterData((prev) => ({
                  ...prev,
                  userId: selected.value === 'all' ? 'all' : Number(selected.value),
                }));
              }}
              onSponsorChange={(selected) => {
                if (!selected) return;
                setDraftFilterData((prev) => ({
                  ...prev,
                  sponsorId: selected.value === 'all' ? 'all' : Number(selected.value),
                }));
              }}
              onFeasibilityChange={(value) => {
                setDraftFilterData((prev) => ({
                  ...prev,
                  feasibilityStatus: value === 'all' ? 'all' : (value as FeasibilityStatus),
                }));
              }}
              onSortChange={(value) => {
                setDraftFilterData((prev) => ({
                  ...prev,
                  selectedSort: value as SponsorActivitiesFilterType['selectedSort'],
                }));
              }}
            />
          </div>
          <div className='mx-auto mt-8 w-fit'>
            <PrimaryButton type='submit'>絞り込む</PrimaryButton>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default FilterModal;
