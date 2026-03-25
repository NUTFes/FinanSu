import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { ActivityStatus, DesignProgress, FeasibilityStatus } from '@/generated/model';
import { useSponsorsByYear } from '@/hooks/sponsor-activities/useSponsorsByYear';
import {
  ACTIVITY_STATUS_OPTIONS,
  DESIGN_PROGRESS_OPTIONS,
  FEASIBILITY_STATUS_OPTIONS,
} from '@/utils/sponsorshipActivity';
import {
  Modal,
  MultiSelect,
  OutlinePrimaryButton,
  PrimaryButton,
  SearchSelect,
  Select,
  Textarea,
  Title,
} from '@components/common';
import { BUREAUS } from '@constants/bureaus';
import { Sponsor, SponsorStyle, User, YearPeriod } from '@type/common';

import { multiSelectStyles } from './multiSelectStyles';

import type { CreateSponsorshipActivityRequest } from '@/generated/model';

interface SearchOption {
  value: string;
  label: string;
}

interface StyleOption {
  value: string;
  label: string;
}

type SponsorActivityEditableFields = Omit<
  CreateSponsorshipActivityRequest,
  'sponsorId' | 'userId' | 'sponsorStyleDetails'
>;

export type SponsorActivityFormInitialValues = Partial<SponsorActivityEditableFields> & {
  sponsorId?: number | null;
  bureauId?: number | null;
  userId?: number | null;
  moneyStyleIds?: number[];
  goodsStyleIds?: number[];
};

interface Props {
  users: User[];
  sponsors: Sponsor[];
  sponsorStyles: SponsorStyle[];
  yearPeriods: YearPeriod[];
  initialValues?: SponsorActivityFormInitialValues;
  submitLabel: string;
  failureMessage: string;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (payload: CreateSponsorshipActivityRequest) => Promise<void>;
  onSaved?: () => Promise<void> | void;
}

interface UseSponsorActivityFormStateParams {
  initialValues?: SponsorActivityFormInitialValues;
  latestYearPeriodId?: number;
}

function useSponsorActivityFormState({
  initialValues,
  latestYearPeriodId,
}: UseSponsorActivityFormStateParams) {
  const [selectedYearPeriodId, setSelectedYearPeriodId] = useState<number>(
    initialValues?.yearPeriodsId ?? latestYearPeriodId ?? 0,
  );
  const [selectedSponsorId, setSelectedSponsorId] = useState<number | null>(
    initialValues?.sponsorId ?? null,
  );
  const [bureauId, setBureauId] = useState<number | null>(initialValues?.bureauId ?? null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    initialValues?.userId ?? null,
  );
  const [activityStatus, setActivityStatus] = useState<ActivityStatus>(
    initialValues?.activityStatus ?? ActivityStatus.unstarted,
  );
  const [feasibilityStatus, setFeasibilityStatus] = useState<FeasibilityStatus>(
    initialValues?.feasibilityStatus ?? FeasibilityStatus.unstarted,
  );
  const [designProgress, setDesignProgress] = useState<DesignProgress>(
    initialValues?.designProgress ?? DesignProgress.unstarted,
  );
  const [remarks, setRemarks] = useState<string>(initialValues?.remarks ?? '');
  const [selectedMoneyStyleIds, setSelectedMoneyStyleIds] = useState<number[]>(
    initialValues?.moneyStyleIds ?? [],
  );
  const [selectedGoodsStyleIds, setSelectedGoodsStyleIds] = useState<number[]>(
    initialValues?.goodsStyleIds ?? [],
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return {
    selectedYearPeriodId,
    setSelectedYearPeriodId,
    selectedSponsorId,
    setSelectedSponsorId,
    bureauId,
    setBureauId,
    selectedUserId,
    setSelectedUserId,
    activityStatus,
    setActivityStatus,
    feasibilityStatus,
    setFeasibilityStatus,
    designProgress,
    setDesignProgress,
    remarks,
    setRemarks,
    selectedMoneyStyleIds,
    setSelectedMoneyStyleIds,
    selectedGoodsStyleIds,
    setSelectedGoodsStyleIds,
    errorMessage,
    setErrorMessage,
    isSubmitting,
    setIsSubmitting,
  };
}

interface CoreInfoFieldsProps {
  selectableYearPeriods: (YearPeriod & { id: number })[];
  selectedYearPeriodId: number;
  sponsorSelectOptions: SearchOption[];
  selectedSponsorOption: SearchOption | null;
  activityStatus: ActivityStatus;
  bureauSelectOptions: SearchOption[];
  selectedBureauOption: SearchOption | null;
  userSelectOptions: SearchOption[];
  selectedUserOption: SearchOption | null;
  onYearPeriodChange: (value: number) => void;
  onSponsorChange: (selected: SearchOption | null) => void;
  onActivityStatusChange: (value: ActivityStatus) => void;
  onBureauChange: (selected: SearchOption | null) => void;
  onUserChange: (selected: SearchOption | null) => void;
}

function CoreInfoFields(props: CoreInfoFieldsProps) {
  return (
    <>
      <p className='text-black-600'>年度</p>
      <div className='w-full'>
        <Select
          value={props.selectedYearPeriodId}
          onChange={(event) => props.onYearPeriodChange(Number(event.target.value))}
        >
          {props.selectableYearPeriods.map((yearPeriod) => (
            <option key={yearPeriod.id} value={yearPeriod.id}>
              {yearPeriod.year}
            </option>
          ))}
        </Select>
      </div>

      <p className='flex items-center gap-0.5 text-black-600'>
        企業名<span className='text-red-500'>*</span>
      </p>
      <div className='w-full'>
        <SearchSelect
          options={props.sponsorSelectOptions}
          value={props.selectedSponsorOption}
          placeholder='企業名で検索'
          noOptionMessage='該当する企業がありません'
          onChange={props.onSponsorChange}
        />
      </div>

      <p className='text-black-600'>ステータス</p>
      <div className='w-full'>
        <Select
          value={props.activityStatus}
          onChange={(event) => props.onActivityStatusChange(event.target.value as ActivityStatus)}
        >
          {ACTIVITY_STATUS_OPTIONS.map((statusOption) => (
            <option key={statusOption.value} value={statusOption.value}>
              {statusOption.label}
            </option>
          ))}
        </Select>
      </div>

      <p className='flex items-center gap-0.5 text-black-600'>
        所属局<span className='text-red-500'>*</span>
      </p>
      <div className='w-full'>
        <SearchSelect
          options={props.bureauSelectOptions}
          value={props.selectedBureauOption}
          placeholder='所属局で検索'
          noOptionMessage='該当する所属局がありません'
          onChange={props.onBureauChange}
        />
      </div>

      <p className='text-black-600'>
        担当者<span className='text-red-500'>*</span>
      </p>
      <div className='w-full'>
        <SearchSelect
          options={props.userSelectOptions}
          value={props.selectedUserOption}
          placeholder='担当者で検索'
          noOptionMessage='該当する担当者がありません'
          onChange={props.onUserChange}
        />
      </div>
    </>
  );
}

interface StyleFieldRowProps {
  categoryLabel: '金' | '物';
  styleOptions: StyleOption[];
  values: StyleOption[];
  onChange: (options: StyleOption[]) => void;
}

function StyleFieldRow(props: StyleFieldRowProps) {
  return (
    <div
      className='flex min-h-10 items-stretch rounded-md border border-primary-1'
    >
      <div
        className='
          flex w-10 shrink-0 items-center justify-center text-black-600
        '
      >
        {props.categoryLabel}
      </div>
      <div className='my-2 w-px shrink-0 bg-grey-200' />
      <div className='min-w-0 flex-1'>
        <MultiSelect
          options={props.styleOptions}
          values={props.values}
          onChange={props.onChange}
          placeholder='選択して下さい'
          customStyles={multiSelectStyles}
        />
      </div>
    </div>
  );
}

interface StyleFieldsProps {
  moneyStyleOptions: StyleOption[];
  goodsStyleOptions: StyleOption[];
  moneyStyleValues: StyleOption[];
  goodsStyleValues: StyleOption[];
  onMoneyStylesChange: (options: StyleOption[]) => void;
  onGoodsStylesChange: (options: StyleOption[]) => void;
}

function StyleFields(props: StyleFieldsProps) {
  return (
    <>
      <p className='text-black-600'>協賛スタイル</p>
      <div className='flex w-full flex-col gap-2'>
        <StyleFieldRow
          categoryLabel='金'
          styleOptions={props.moneyStyleOptions}
          values={props.moneyStyleValues}
          onChange={props.onMoneyStylesChange}
        />
        <StyleFieldRow
          categoryLabel='物'
          styleOptions={props.goodsStyleOptions}
          values={props.goodsStyleValues}
          onChange={props.onGoodsStylesChange}
        />
      </div>
    </>
  );
}

function useSponsorActivityFormModel(props: Props) {
  const router = useRouter();
  const { users, sponsorStyles, yearPeriods, initialValues } = props;

  const selectableYearPeriods = useMemo(
    () =>
      yearPeriods.filter(
        (yearPeriod): yearPeriod is YearPeriod & { id: number } => yearPeriod.id !== undefined,
      ),
    [yearPeriods],
  );
  const latestYearPeriod = selectableYearPeriods[selectableYearPeriods.length - 1];
  const {
    selectedYearPeriodId,
    setSelectedYearPeriodId,
    selectedSponsorId,
    setSelectedSponsorId,
    bureauId,
    setBureauId,
    selectedUserId,
    setSelectedUserId,
    activityStatus,
    setActivityStatus,
    feasibilityStatus,
    setFeasibilityStatus,
    designProgress,
    setDesignProgress,
    remarks,
    setRemarks,
    selectedMoneyStyleIds,
    setSelectedMoneyStyleIds,
    selectedGoodsStyleIds,
    setSelectedGoodsStyleIds,
    errorMessage,
    setErrorMessage,
    isSubmitting,
    setIsSubmitting,
  } = useSponsorActivityFormState({
    initialValues,
    latestYearPeriodId: latestYearPeriod?.id,
  });
  const selectedYear = useMemo(() => {
    const selectedPeriod = selectableYearPeriods.find((yp) => yp.id === selectedYearPeriodId);
    return Number(selectedPeriod?.year ?? new Date().getFullYear());
  }, [selectableYearPeriods, selectedYearPeriodId]);
  const sponsors = useSponsorsByYear({
    year: selectedYear,
    initialSponsors: props.sponsors || [],
  });

  const selectableSponsorStyles = useMemo(
    () =>
      sponsorStyles.filter(
        (style): style is SponsorStyle & { id: number } => style.id !== undefined,
      ),
    [sponsorStyles],
  );

  const styleOptions = useMemo<StyleOption[]>(
    () =>
      selectableSponsorStyles.map((style) => ({
        value: String(style.id),
        label: [style.style, style.feature].filter(Boolean).join(' / '),
      })),
    [selectableSponsorStyles],
  );

  const styleOptionsMap = useMemo(() => {
    const map = new Map<number, StyleOption>();
    for (const option of styleOptions) {
      map.set(Number(option.value), option);
    }
    return map;
  }, [styleOptions]);

  const sponsorSelectOptions = useMemo<SearchOption[]>(
    () =>
      sponsors
        .filter((sponsor): sponsor is Sponsor & { id: number } => sponsor.id !== undefined)
        .map((sponsor) => ({
          value: String(sponsor.id),
          label: sponsor.name,
        })),
    [sponsors],
  );

  const selectedSponsorOption = useMemo(
    () => sponsorSelectOptions.find((option) => option.value === String(selectedSponsorId)) || null,
    [sponsorSelectOptions, selectedSponsorId],
  );

  const bureauSelectOptions = useMemo<SearchOption[]>(
    () =>
      BUREAUS.map((bureau) => ({
        value: String(bureau.id),
        label: bureau.name,
      })),
    [],
  );

  const bureauNameMap = useMemo(
    () => new Map(BUREAUS.map((bureau) => [bureau.id, bureau.name])),
    [],
  );

  const selectedBureauOption = useMemo(
    () =>
      bureauId === null
        ? null
        : bureauSelectOptions.find((option) => option.value === String(bureauId)) || null,
    [bureauSelectOptions, bureauId],
  );

  const filteredUsers = useMemo(() => {
    if (bureauId === null) return users;
    return users.filter((user) => user.bureauID === bureauId);
  }, [users, bureauId]);

  const userSelectOptions = useMemo<SearchOption[]>(
    () =>
      filteredUsers.map((user) => ({
        value: String(user.id),
        label:
          bureauId === null
            ? `${user.name}（${bureauNameMap.get(user.bureauID) ?? '所属局未設定'}）`
            : user.name,
      })),
    [bureauId, bureauNameMap, filteredUsers],
  );

  const selectedUserOption = useMemo(
    () =>
      selectedUserId === null
        ? null
        : userSelectOptions.find((option) => option.value === String(selectedUserId)) || null,
    [selectedUserId, userSelectOptions],
  );

  const moneyStyleValues = useMemo(
    () =>
      selectedMoneyStyleIds
        .map((id) => styleOptionsMap.get(id))
        .filter((option): option is StyleOption => option !== undefined),
    [selectedMoneyStyleIds, styleOptionsMap],
  );

  const goodsStyleValues = useMemo(
    () =>
      selectedGoodsStyleIds
        .map((id) => styleOptionsMap.get(id))
        .filter((option): option is StyleOption => option !== undefined),
    [selectedGoodsStyleIds, styleOptionsMap],
  );

  const selectedMoneyStyleIdSet = useMemo(
    () => new Set(selectedMoneyStyleIds),
    [selectedMoneyStyleIds],
  );
  const selectedGoodsStyleIdSet = useMemo(
    () => new Set(selectedGoodsStyleIds),
    [selectedGoodsStyleIds],
  );
  const moneyStyleOptions = useMemo(
    () => styleOptions.filter((option) => !selectedGoodsStyleIdSet.has(Number(option.value))),
    [selectedGoodsStyleIdSet, styleOptions],
  );
  const goodsStyleOptions = useMemo(
    () => styleOptions.filter((option) => !selectedMoneyStyleIdSet.has(Number(option.value))),
    [selectedMoneyStyleIdSet, styleOptions],
  );

  // Sync selected user when selectable users change
  useEffect(() => {
    if (!filteredUsers.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(null);
    }
  }, [filteredUsers, selectedUserId, setSelectedUserId]);

  // Sync sponsor selection when sponsors list changes (e.g. year change)
  useEffect(() => {
    if (sponsors.length === 0) {
      setSelectedSponsorId(null);
      return;
    }

    if (
      selectedSponsorId !== null &&
      !sponsors.some((sponsor) => sponsor.id === selectedSponsorId)
    ) {
      setSelectedSponsorId(null);
    }
  }, [selectedSponsorId, setSelectedSponsorId, sponsors]);

  const onClose = () => {
    props.setIsOpen(false);
  };

  const handleSponsorChange = (selected: SearchOption | null) => {
    if (!selected) return;
    setSelectedSponsorId(Number(selected.value));
  };

  const handleBureauChange = (selected: SearchOption | null) => {
    if (!selected) return;
    const nextBureauId = Number(selected.value);
    const nextUsers = users.filter((user) => user.bureauID === nextBureauId);
    setBureauId(nextBureauId);
    setSelectedUserId((prev) => (nextUsers.some((user) => user.id === prev) ? prev : null));
  };

  const handleUserChange = (selected: SearchOption | null) => {
    if (!selected) return;
    const nextUserId = Number(selected.value);
    setSelectedUserId(nextUserId);

    const selectedUser = users.find((user) => user.id === nextUserId);
    if (selectedUser) {
      setBureauId(selectedUser.bureauID);
    }
  };

  const handleActivityStatusChange = (nextActivityStatus: ActivityStatus) => {
    setActivityStatus(nextActivityStatus);

    if (nextActivityStatus === ActivityStatus.rejected) {
      setFeasibilityStatus((prev) =>
        prev === FeasibilityStatus.unstarted ? FeasibilityStatus.impossible : prev,
      );
    }
  };

  const handleMoneyStylesChange = (options: StyleOption[]) => {
    const nextMoneyStyleIds = options.map((option) => Number(option.value));
    setSelectedMoneyStyleIds(nextMoneyStyleIds);
    setSelectedGoodsStyleIds((prev) =>
      prev.filter((styleId) => !nextMoneyStyleIds.includes(styleId)),
    );
  };

  const handleGoodsStylesChange = (options: StyleOption[]) => {
    const nextGoodsStyleIds = options.map((option) => Number(option.value));
    setSelectedGoodsStyleIds(nextGoodsStyleIds);
    setSelectedMoneyStyleIds((prev) =>
      prev.filter((styleId) => !nextGoodsStyleIds.includes(styleId)),
    );
  };

  const submit = async () => {
    const uniqueMoneyStyleIds = Array.from(new Set(selectedMoneyStyleIds));
    const uniqueGoodsStyleIds = Array.from(new Set(selectedGoodsStyleIds)).filter(
      (styleId) => !uniqueMoneyStyleIds.includes(styleId),
    );

    if (!selectedYearPeriodId) {
      setErrorMessage('年度が不正です。');
      return;
    }
    if (!selectedSponsorId) {
      setErrorMessage('企業名を候補から選択してください。');
      return;
    }
    if (!selectedUserId) {
      setErrorMessage('担当者を選択してください。');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const payload: CreateSponsorshipActivityRequest = {
      yearPeriodsId: selectedYearPeriodId,
      sponsorId: selectedSponsorId,
      userId: selectedUserId,
      activityStatus,
      feasibilityStatus,
      designProgress,
      remarks: remarks.trim() || undefined,
      sponsorStyleDetails: [
        ...uniqueMoneyStyleIds.map((styleId) => ({
          sponsorStyleId: styleId,
          category: 'money' as const,
        })),
        ...uniqueGoodsStyleIds.map((styleId) => ({
          sponsorStyleId: styleId,
          category: 'goods' as const,
        })),
      ],
    };

    try {
      await props.onSubmit(payload);
      props.setIsOpen(false);
      if (props.onSaved) {
        await props.onSaved();
      } else {
        router.reload();
      }
    } catch {
      setErrorMessage(props.failureMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectableYearPeriods,
    selectedYearPeriodId,
    setSelectedYearPeriodId,
    sponsorSelectOptions,
    selectedSponsorOption,
    activityStatus,
    handleActivityStatusChange,
    bureauSelectOptions,
    selectedBureauOption,
    userSelectOptions,
    selectedUserOption,
    handleSponsorChange,
    handleBureauChange,
    handleUserChange,
    feasibilityStatus,
    setFeasibilityStatus,
    moneyStyleOptions,
    goodsStyleOptions,
    moneyStyleValues,
    goodsStyleValues,
    handleMoneyStylesChange,
    handleGoodsStylesChange,
    designProgress,
    setDesignProgress,
    remarks,
    setRemarks,
    errorMessage,
    isSubmitting,
    onClose,
    submit,
  };
}

export default function SponsorActivityForm(props: Props) {
  const model = useSponsorActivityFormModel(props);

  return (
    <Modal
      className='
        px-20 py-12
        md:w-1/3
      '
      onClick={model.onClose}
    >
      <Title>
        <p>協賛企業</p>
        <p>修正・登録</p>
      </Title>
      <div
        className='
          mx-auto mt-8 grid w-full grid-cols-[7rem_minmax(0,1fr)] items-start
          gap-x-4 gap-y-5
          [&>p]:whitespace-nowrap
        '
      >
        <CoreInfoFields
          selectableYearPeriods={model.selectableYearPeriods}
          selectedYearPeriodId={model.selectedYearPeriodId}
          sponsorSelectOptions={model.sponsorSelectOptions}
          selectedSponsorOption={model.selectedSponsorOption}
          activityStatus={model.activityStatus}
          bureauSelectOptions={model.bureauSelectOptions}
          selectedBureauOption={model.selectedBureauOption}
          userSelectOptions={model.userSelectOptions}
          selectedUserOption={model.selectedUserOption}
          onYearPeriodChange={model.setSelectedYearPeriodId}
          onSponsorChange={model.handleSponsorChange}
          onActivityStatusChange={model.handleActivityStatusChange}
          onBureauChange={model.handleBureauChange}
          onUserChange={model.handleUserChange}
        />

        <p className='text-black-600'>協賛可否</p>
        <div className='w-full'>
          <Select
            value={model.feasibilityStatus}
            onChange={(event) =>
              model.setFeasibilityStatus(event.target.value as FeasibilityStatus)
            }
          >
            {FEASIBILITY_STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </Select>
        </div>

        <StyleFields
          moneyStyleOptions={model.moneyStyleOptions}
          goodsStyleOptions={model.goodsStyleOptions}
          moneyStyleValues={model.moneyStyleValues}
          goodsStyleValues={model.goodsStyleValues}
          onMoneyStylesChange={model.handleMoneyStylesChange}
          onGoodsStylesChange={model.handleGoodsStylesChange}
        />

        <p className='text-black-600'>デザイン</p>
        <div className='w-full'>
          <Select
            value={model.designProgress}
            onChange={(event) => model.setDesignProgress(event.target.value as DesignProgress)}
          >
            {DESIGN_PROGRESS_OPTIONS.map((progressOption) => (
              <option key={progressOption.value} value={progressOption.value}>
                {progressOption.label}
              </option>
            ))}
          </Select>
        </div>

        <p className='text-black-600'>備考</p>
        <div className='w-full'>
          <Textarea
            className='w-full'
            value={model.remarks}
            onChange={(event) => model.setRemarks(event.target.value)}
            placeholder='備考を入力'
          />
        </div>
      </div>

      {model.errorMessage && (
        <div className='mb-4 text-center text-sm text-red-600'>{model.errorMessage}</div>
      )}

      <div className='mt-5 flex flex-row justify-center gap-17.5'>
        <OutlinePrimaryButton onClick={model.onClose}>戻る</OutlinePrimaryButton>
        <PrimaryButton onClick={model.submit} disabled={model.isSubmitting}>
          {props.submitLabel}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
