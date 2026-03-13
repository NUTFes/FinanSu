import clsx from 'clsx';
import Head from 'next/head';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import {
  EditButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Loading,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  Select,
  Spinner,
  Textarea,
} from '@/components/common';
import MainLayout from '@/components/layout/MainLayout';
import {
  useGetSponsorshipActivities,
  useGetSponsorshipActivitiesId,
  useGetSponsorstyles,
  usePutSponsorshipActivitiesId,
} from '@/generated/hooks';
import {
  ActivityStatus,
  DesignProgress,
  FeasibilityStatus,
  UpdateSponsorshipActivityRequestSponsorStyleDetailsItemCategory,
} from '@/generated/model';
import { useToast } from '@/hooks/useToast';
import {
  ACTIVITY_STATUS_LABELS,
  DESIGN_PROGRESS_LABELS,
  FEASIBILITY_STATUS_LABELS,
  SPONSOR_STYLE_CATEGORY_LABELS,
  SponsorshipActivityProgressReportFormValues,
  buildSponsorshipActivityProgressReportPayload,
  extractSponsorStyleOptions,
  extractSponsorStyleOptionsFromActivity,
  getDefaultProgressReportValues,
  mergeSponsorStyleOptions,
} from '@/utils/sponsorshipActivityProgressReport';

import type { NextPage } from 'next';

const READ_ONLY_FIELD_CLASS_NAME =
  'rounded-none border-0 border-b border-primary-1 bg-transparent px-0 py-2 text-base text-black-300 shadow-none focus:border-primary-1 focus:ring-0';

const OUTLINE_ACTION_CLASS_NAME =
  'min-w-28 justify-center border-primary-1 px-6 py-2 text-primary-1';

const PRIMARY_ACTION_CLASS_NAME = 'min-w-32 justify-center px-8 py-2';

interface FieldRowProps {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
}

const FieldRow = ({ id, label, required = false, children, error }: FieldRowProps) => (
  <FormControl
    id={id}
    isRequired={required}
    isInvalid={Boolean(error)}
    className='grid gap-3 md:grid-cols-[132px_minmax(0,1fr)] md:items-start'
  >
    <FormLabel className='mb-0 pt-3 text-base text-black-600'>{label}</FormLabel>
    <div>
      {children}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  </FormControl>
);

const ProgressReportPage: NextPage = () => {
  const toast = useToast();
  const initializedActivityIdRef = useRef<number | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const isModalOpen = selectedActivityId !== null;

  const {
    data: activitiesResponse,
    isLoading: isActivitiesLoading,
    error: activitiesError,
    mutate: mutateActivities,
  } = useGetSponsorshipActivities(undefined, {
    swr: {
      revalidateOnFocus: false,
    },
  });
  const activities = activitiesResponse?.data.activities ?? [];

  const {
    data: activityResponse,
    isLoading: isActivityLoading,
    error: activityError,
    mutate: mutateActivityDetail,
  } = useGetSponsorshipActivitiesId(selectedActivityId ?? 0, {
    swr: {
      enabled: isModalOpen,
      revalidateOnFocus: false,
    },
  });

  const {
    data: sponsorStylesResponse,
    isLoading: isSponsorStylesLoading,
    error: sponsorStylesError,
  } = useGetSponsorstyles({
    swr: {
      revalidateOnFocus: false,
    },
  });

  const { trigger: updateSponsorshipActivity, isMutating: isUpdating } =
    usePutSponsorshipActivitiesId(selectedActivityId ?? 0);

  const activity = activityResponse?.data;
  const sponsor = activity?.sponsor;

  const sponsorStyleOptions = useMemo(
    () =>
      mergeSponsorStyleOptions(
        extractSponsorStyleOptions(sponsorStylesResponse?.data),
        extractSponsorStyleOptionsFromActivity(activity),
      ),
    [activity, sponsorStylesResponse?.data],
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SponsorshipActivityProgressReportFormValues>({
    defaultValues: {
      designProgress: DesignProgress.unstarted,
      activityStatus: ActivityStatus.unstarted,
      feasibilityStatus: FeasibilityStatus.unstarted,
      remarks: '',
      sponsorStyleDetails: [],
    },
  });

  const selectedSponsorStyleDetails = useWatch({
    control,
    name: 'sponsorStyleDetails',
  });

  useEffect(() => {
    if (!activity?.id) {
      return;
    }

    if (initializedActivityIdRef.current === activity.id) {
      return;
    }

    reset(getDefaultProgressReportValues(activity));
    initializedActivityIdRef.current = activity.id;
  }, [activity, reset]);

  const closeModal = () => {
    setSelectedActivityId(null);
    initializedActivityIdRef.current = null;
    reset({
      designProgress: DesignProgress.unstarted,
      activityStatus: ActivityStatus.unstarted,
      feasibilityStatus: FeasibilityStatus.unstarted,
      remarks: '',
      sponsorStyleDetails: [],
    });
  };

  const selectedSponsorStyleMap = useMemo(
    () =>
      new Map(
        (selectedSponsorStyleDetails ?? []).map((detail) => [
          detail.sponsorStyleId,
          detail.category,
        ]),
      ),
    [selectedSponsorStyleDetails],
  );

  const toggleSponsorStyle = (sponsorStyleId: number) => {
    const currentValue = selectedSponsorStyleDetails ?? [];
    const isSelected = currentValue.some((detail) => detail.sponsorStyleId === sponsorStyleId);

    const nextValue = isSelected
      ? currentValue.filter((detail) => detail.sponsorStyleId !== sponsorStyleId)
      : [
          ...currentValue,
          {
            sponsorStyleId,
            category: UpdateSponsorshipActivityRequestSponsorStyleDetailsItemCategory.money,
          },
        ];

    setValue('sponsorStyleDetails', nextValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const updateSponsorStyleCategory = (
    sponsorStyleId: number,
    category: UpdateSponsorshipActivityRequestSponsorStyleDetailsItemCategory,
  ) => {
    const currentValue = selectedSponsorStyleDetails ?? [];
    const nextValue = currentValue.map((detail) =>
      detail.sponsorStyleId === sponsorStyleId ? { ...detail, category } : detail,
    );

    setValue('sponsorStyleDetails', nextValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  // Placeholder until receipt / invoice issuance APIs are connected to this page.
  const handleDocumentPlaceholder = (documentType: 'receipt' | 'invoice') => {
    toast({
      title: documentType === 'receipt' ? '領収書発行は未接続です' : '請求書発行は未接続です',
      description: '発行 API は未接続のため、将来の拡張用プレースホルダーとして保持しています。',
      status: 'info',
      duration: 4000,
      isClosable: true,
    });
  };

  const onSubmit = async (values: SponsorshipActivityProgressReportFormValues) => {
    if (!activity || selectedActivityId === null) {
      toast({
        title: '更新対象が見つかりません',
        description: '編集対象を選択してから再度お試しください。',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      const payload = buildSponsorshipActivityProgressReportPayload(activity, values);
      await updateSponsorshipActivity(payload);
      await Promise.all([mutateActivities(), mutateActivityDetail()]);

      toast({
        title: '更新しました',
        description: '進捗報告を更新しました。',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      closeModal();
    } catch (error) {
      console.error('Failed to update sponsorship activity progress report:', error);
      toast({
        title: '更新に失敗しました',
        description: '入力内容を確認して、しばらくしてから再度お試しください。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const toActivityStatusLabel = (status?: ActivityStatus) => {
    if (!status) return '未定';
    return ACTIVITY_STATUS_LABELS[status] ?? '未定';
  };

  const toDesignProgressLabel = (designProgress?: DesignProgress) => {
    if (!designProgress) return '未定';
    return DESIGN_PROGRESS_LABELS[designProgress] ?? '未定';
  };

  return (
    <MainLayout>
      <Head>
        <title>進捗報告ページ</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div className='min-h-[calc(100vh-4rem)] bg-white-0 px-4 py-10 md:px-8 md:py-16'>
        <div className='mx-auto mt-8 max-w-5xl rounded-2xl border border-grey-200 px-8 py-7 shadow-[0_4px_14px_rgba(0,0,0,0.12)]'>
          <div className='mb-3 flex flex-wrap items-center justify-between gap-3'>
            <div className='text-2xl leading-8 font-thin tracking-widest text-black-600'>
              進捗報告
            </div>
            <div className='flex flex-wrap gap-3'>
              <OutlinePrimaryButton
                className='min-w-52 justify-center border-primary-1 px-4 py-2 text-md text-primary-1'
                onClick={() => handleDocumentPlaceholder('receipt')}
              >
                手書きで領収書発行
              </OutlinePrimaryButton>
              <OutlinePrimaryButton
                className='min-w-52 justify-center border-primary-1 px-4 py-2 text-md text-primary-1'
                onClick={() => handleDocumentPlaceholder('invoice')}
              >
                手書きで請求書発行
              </OutlinePrimaryButton>
            </div>
          </div>
          <div className='overflow-auto'>
            <table className='w-full table-auto border-collapse'>
              <thead>
                <tr className='border-b border-primary-1'>
                  <th className='px-4 pb-2 text-left text-sm font-normal whitespace-nowrap text-black-600'>
                    企業名
                  </th>
                  <th className='px-4 pb-2 text-left text-sm font-normal whitespace-nowrap text-black-600'>
                    代表者
                  </th>
                  <th className='px-4 pb-2 text-left text-sm font-normal whitespace-nowrap text-black-600'>
                    e-mail
                  </th>
                  <th className='px-4 pb-2 text-left text-sm font-normal whitespace-nowrap text-black-600'>
                    ステータス
                  </th>
                  <th className='px-4 pb-2 text-left text-sm font-normal whitespace-nowrap text-black-600'>
                    協賛スタイル
                  </th>
                  <th className='px-4 pb-2 text-left text-sm font-normal whitespace-nowrap text-black-600'>
                    デザイン
                  </th>
                  <th className='px-4 py-3 text-center text-sm font-normal text-black-600'></th>
                </tr>
              </thead>
              <tbody>
                {isActivitiesLoading && (
                  <tr className='border-b border-grey-200'>
                    <td colSpan={7} className='px-4 py-8'>
                      <div className='flex items-center justify-center gap-2 text-sm text-black-600'>
                        <Spinner size='sm' />
                        読み込み中...
                      </div>
                    </td>
                  </tr>
                )}
                {!isActivitiesLoading && Boolean(activitiesError) && (
                  <tr className='border-b border-grey-200'>
                    <td colSpan={7} className='px-4 py-8 text-center text-sm text-accent-1'>
                      進捗報告一覧の取得に失敗しました。ページを更新してください。
                    </td>
                  </tr>
                )}
                {!isActivitiesLoading && !activitiesError && activities.length === 0 && (
                  <tr className='border-b border-grey-200'>
                    <td colSpan={7} className='px-4 py-8 text-center text-sm text-black-600'>
                      データがありません
                    </td>
                  </tr>
                )}
                {!isActivitiesLoading &&
                  !Boolean(activitiesError) &&
                  activities.length > 0 &&
                  activities.map((item) => (
                    <tr key={item.id} className='border-b border-grey-200 hover:bg-grey-50'>
                      <td className='px-4 py-3 text-left text-sm whitespace-nowrap text-black-600'>
                        {item.sponsor?.name ?? '-'}
                      </td>
                      <td className='px-4 py-3 text-left text-sm whitespace-nowrap text-black-600'>
                        {item.sponsor?.representative ?? '-'}
                      </td>
                      <td className='px-4 py-3 text-left text-sm whitespace-nowrap text-black-600'>
                        {item.sponsor?.email ?? '-'}
                      </td>
                      <td className='px-4 py-3 text-left text-sm whitespace-nowrap text-black-600'>
                        {toActivityStatusLabel(item.activityStatus)}
                      </td>
                      <td className='px-4 py-3 text-left text-sm text-black-600'>
                        {item.sponsorStyles && item.sponsorStyles.length > 0 ? (
                          <div className='space-y-1'>
                            {item.sponsorStyles.map((sponsorStyleLink, index) => (
                              <div key={`${item.id}-${sponsorStyleLink.sponsorStyleId}-${index}`}>
                                {`${
                                  sponsorStyleLink.category === 'money'
                                    ? '金'
                                    : sponsorStyleLink.category === 'goods'
                                    ? '物'
                                    : ''
                                } ${sponsorStyleLink.style?.style ?? ''}${
                                  sponsorStyleLink.style?.feature
                                    ? ` ${sponsorStyleLink.style.feature}`
                                    : ''
                                }`.trim()}
                              </div>
                            ))}
                          </div>
                        ) : (
                          '未定'
                        )}
                      </td>
                      <td className='px-4 py-3 text-left text-sm whitespace-nowrap text-black-600'>
                        {toDesignProgressLabel(item.designProgress)}
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <div className='flex justify-center'>
                          <EditButton
                            onClick={() => {
                              if (item.id) setSelectedActivityId(item.id);
                            }}
                            isDisabled={!item.id}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          onClick={closeModal}
          className='w-[min(92vw,760px)] rounded-[20px] px-6 py-8 md:px-10 md:py-10'
        >
          {isActivityLoading && (
            <div className='flex h-52 items-center justify-center'>
              <Loading />
            </div>
          )}

          {!isActivityLoading && Boolean(activityError) && (
            <div className='space-y-6 py-6 text-center'>
              <p className='text-accent-1'>進捗報告データの取得中にエラーが発生しました。</p>
              <div className='flex justify-center'>
                <OutlinePrimaryButton onClick={closeModal}>戻る</OutlinePrimaryButton>
              </div>
            </div>
          )}

          {!isActivityLoading && !activityError && !activity && (
            <div className='space-y-6 py-6 text-center'>
              <p className='text-black-600'>対象の進捗報告データが見つかりませんでした。</p>
              <div className='flex justify-center'>
                <OutlinePrimaryButton onClick={closeModal}>戻る</OutlinePrimaryButton>
              </div>
            </div>
          )}

          {!isActivityLoading && !activityError && activity && (
            <>
              <div className='mb-8 text-center'>
                <h1 className='text-2xl font-light tracking-[0.16em] text-black-900 md:text-4xl'>
                  {sponsor?.name ?? '協賛企業'}
                </h1>
              </div>

              <div className='space-y-6'>
                <FieldRow id='representative' label='代表者'>
                  <Input
                    id='representative'
                    readOnly
                    value={sponsor?.representative ?? ''}
                    className={READ_ONLY_FIELD_CLASS_NAME}
                  />
                </FieldRow>

                <FieldRow id='phone' label='電話'>
                  <Input
                    id='phone'
                    readOnly
                    value={sponsor?.tel ?? ''}
                    className={READ_ONLY_FIELD_CLASS_NAME}
                  />
                </FieldRow>

                <FieldRow id='email' label='メール'>
                  <Input
                    id='email'
                    readOnly
                    value={sponsor?.email ?? ''}
                    className={READ_ONLY_FIELD_CLASS_NAME}
                  />
                </FieldRow>

                <Controller
                  name='designProgress'
                  control={control}
                  rules={{ required: 'デザイン進捗を選択してください。' }}
                  render={({ field, fieldState }) => (
                    <FieldRow
                      id='designProgress'
                      label='デザイン'
                      required
                      error={fieldState.error?.message}
                    >
                      <Select id='designProgress' value={field.value} onChange={field.onChange}>
                        {Object.entries(DESIGN_PROGRESS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </FieldRow>
                  )}
                />

                <Controller
                  name='sponsorStyleDetails'
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.length > 0 || '協賛スタイルを1つ以上選択してください。',
                  }}
                  render={({ fieldState }) => (
                    <FieldRow
                      id='sponsorStyleDetails'
                      label='協賛スタイル'
                      required
                      error={fieldState.error?.message}
                    >
                      <div className='rounded-[28px] border border-primary-1/60 bg-[#f9fdff] p-4'>
                        <div className='flex flex-wrap gap-2'>
                          {sponsorStyleOptions.map((option) => {
                            const isSelected = selectedSponsorStyleMap.has(option.id);

                            return (
                              <button
                                key={option.id}
                                type='button'
                                className={clsx(
                                  'rounded-full border px-4 py-2 text-left text-sm transition-colors',
                                  isSelected
                                    ? 'border-primary-1 bg-primary-1/15 text-primary-5'
                                    : 'border-grey-300 bg-white-0 text-black-600 hover:border-primary-1 hover:text-primary-5',
                                )}
                                onClick={() => toggleSponsorStyle(option.id)}
                              >
                                <span className='font-medium'>{option.style}</span>
                                <span className='mx-1 text-black-900'>/</span>
                                <span>{option.feature}</span>
                                <span className='ml-2 whitespace-nowrap'>
                                  {option.price.toLocaleString()}円
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {Boolean(sponsorStylesError) && (
                          <p className='mt-3 text-sm text-black-600'>
                            協賛スタイル一覧の取得に失敗したため、現在紐づいているスタイルを中心に編集できます。
                          </p>
                        )}

                        {isSponsorStylesLoading && sponsorStyleOptions.length === 0 && (
                          <div className='mt-3 flex items-center gap-2 text-sm text-black-600'>
                            <Spinner size='sm' />
                            協賛スタイルを読み込み中...
                          </div>
                        )}

                        {(selectedSponsorStyleDetails ?? []).length > 0 && (
                          <div className='mt-4 space-y-3'>
                            {(selectedSponsorStyleDetails ?? []).map((detail) => {
                              const option = sponsorStyleOptions.find(
                                (sponsorStyleOption) =>
                                  sponsorStyleOption.id === detail.sponsorStyleId,
                              );

                              return (
                                <div
                                  key={detail.sponsorStyleId}
                                  className='grid gap-3 rounded-2xl bg-white-0 p-3 md:grid-cols-[minmax(0,1fr)_170px]'
                                >
                                  <div className='text-sm text-black-300'>
                                    <div className='font-medium'>
                                      {option?.style ?? `スタイルID: ${detail.sponsorStyleId}`}
                                    </div>
                                    {option && (
                                      <div className='mt-1 text-black-600'>
                                        {option.feature} / {option.price.toLocaleString()}円
                                      </div>
                                    )}
                                  </div>
                                  <Select
                                    value={detail.category}
                                    onChange={(event) =>
                                      updateSponsorStyleCategory(
                                        detail.sponsorStyleId,
                                        event.target
                                          .value as UpdateSponsorshipActivityRequestSponsorStyleDetailsItemCategory,
                                      )
                                    }
                                  >
                                    {Object.entries(SPONSOR_STYLE_CATEGORY_LABELS).map(
                                      ([value, label]) => (
                                        <option key={value} value={value}>
                                          {label}
                                        </option>
                                      ),
                                    )}
                                  </Select>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </FieldRow>
                  )}
                />

                <Controller
                  name='activityStatus'
                  control={control}
                  rules={{ required: '活動ステータスを選択してください。' }}
                  render={({ field, fieldState }) => (
                    <FieldRow
                      id='activityStatus'
                      label='進捗状況'
                      required
                      error={fieldState.error?.message}
                    >
                      <Select id='activityStatus' value={field.value} onChange={field.onChange}>
                        {Object.entries(ACTIVITY_STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </FieldRow>
                  )}
                />

                <Controller
                  name='feasibilityStatus'
                  control={control}
                  rules={{ required: '協賛可否を選択してください。' }}
                  render={({ field, fieldState }) => (
                    <FieldRow
                      id='feasibilityStatus'
                      label='協賛可否'
                      required
                      error={fieldState.error?.message}
                    >
                      <Select id='feasibilityStatus' value={field.value} onChange={field.onChange}>
                        {Object.entries(FEASIBILITY_STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </FieldRow>
                  )}
                />

                <div className='flex flex-wrap justify-center gap-3 pt-2'>
                  <OutlinePrimaryButton
                    className={OUTLINE_ACTION_CLASS_NAME}
                    onClick={() => handleDocumentPlaceholder('receipt')}
                    disabled={isUpdating}
                  >
                    領収書発行
                  </OutlinePrimaryButton>
                  <OutlinePrimaryButton
                    className={OUTLINE_ACTION_CLASS_NAME}
                    onClick={() => handleDocumentPlaceholder('invoice')}
                    disabled={isUpdating}
                  >
                    請求書発行
                  </OutlinePrimaryButton>
                </div>

                <Controller
                  name='remarks'
                  control={control}
                  render={({ field }) => (
                    <FieldRow id='remarks' label='備考'>
                      <Textarea
                        id='remarks'
                        value={field.value}
                        onChange={field.onChange}
                        className='h-28 w-full border-primary-1 text-black-300'
                        placeholder='備考があれば入力してください'
                      />
                    </FieldRow>
                  )}
                />
              </div>

              {Object.keys(errors).length > 0 && (
                <div className='mt-6 rounded-2xl bg-accent-1/8 px-4 py-3 text-sm text-accent-1'>
                  入力内容を確認してください。
                </div>
              )}

              <div className='mt-10 flex flex-wrap justify-center gap-4'>
                <OutlinePrimaryButton
                  className={OUTLINE_ACTION_CLASS_NAME}
                  onClick={closeModal}
                  disabled={isUpdating}
                >
                  戻る
                </OutlinePrimaryButton>
                <PrimaryButton
                  type='button'
                  className={PRIMARY_ACTION_CLASS_NAME}
                  onClick={() => {
                    void handleSubmit(onSubmit)();
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Spinner size='sm' color='white' className='mr-2' /> : null}
                  編集完了
                </PrimaryButton>
              </div>
            </>
          )}
        </Modal>
      )}
    </MainLayout>
  );
};

export default ProgressReportPage;
