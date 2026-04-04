import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormHandleSubmit,
} from 'react-hook-form';

import {
  Input,
  Loading,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  Select,
  Spinner,
} from '@/components/common';
import type { SponsorshipActivity } from '@/generated/model';
import {
  ACTIVITY_STATUS_LABELS,
  DESIGN_PROGRESS_LABELS,
  type SponsorshipActivityProgressReportFormValues,
} from '@/utils/sponsorshipActivityProgressReport';

import ProgressReportFieldRow from '@/components/progress-report/ProgressReportFieldRow';

const READ_ONLY_FIELD_CLASS_NAME =
  'pointer-events-none w-full rounded-none border-0 border-b border-[#56daff] bg-transparent px-0 py-1 text-base text-[#666666] shadow-none focus:border-[#56daff] focus:ring-0';

const OUTLINE_ACTION_CLASS_NAME =
  'min-w-28 justify-center border-[#56daff] px-6 py-1.5 text-[#56daff] font-normal';

const PRIMARY_ACTION_CLASS_NAME = 'min-w-36 justify-center px-8 py-2 font-normal';

interface ProgressReportModalProps {
  isOpen: boolean;
  isLoading: boolean;
  hasError: boolean;
  activity?: SponsorshipActivity;
  formattedSponsorStyles: string;
  isUpdating: boolean;
  control: Control<SponsorshipActivityProgressReportFormValues>;
  handleSubmit: UseFormHandleSubmit<SponsorshipActivityProgressReportFormValues>;
  errors: FieldErrors<SponsorshipActivityProgressReportFormValues>;
  onClose: () => void;
  onSubmit: (values: SponsorshipActivityProgressReportFormValues) => Promise<void>;
  onDocumentPlaceholder: (documentType: 'receipt' | 'invoice') => void;
}

export default function ProgressReportModal({
  isOpen,
  isLoading,
  hasError,
  activity,
  formattedSponsorStyles,
  isUpdating,
  control,
  handleSubmit,
  errors,
  onClose,
  onSubmit,
  onDocumentPlaceholder,
}: ProgressReportModalProps) {
  if (!isOpen) return null;

  const sponsor = activity?.sponsor;

  return (
    <Modal
      onClick={onClose}
      className='w-[min(94vw,540px)] rounded-[24px] bg-[#f2f2f2] px-6 py-8 md:px-10 md:py-10'
    >
      {isLoading && (
        <div className='flex h-52 items-center justify-center'>
          <Loading />
        </div>
      )}

      {!isLoading && hasError && (
        <div className='space-y-6 py-6 text-center'>
          <p className='text-[#e4434e]'>進捗報告データの取得中にエラーが発生しました。</p>
          <div className='flex justify-center'>
            <OutlinePrimaryButton onClick={onClose}>戻る</OutlinePrimaryButton>
          </div>
        </div>
      )}

      {!isLoading && !hasError && !activity && (
        <div className='space-y-6 py-6 text-center'>
          <p className='text-[#666666]'>対象の進捗報告データが見つかりませんでした。</p>
          <div className='flex justify-center'>
            <OutlinePrimaryButton onClick={onClose}>戻る</OutlinePrimaryButton>
          </div>
        </div>
      )}

      {!isLoading && !hasError && activity && (
        <>
          <div className='mb-8 text-center'>
            <h1 className='text-[24px] font-thin tracking-[0.14em] text-[#999999] md:text-[24px]'>
              {sponsor?.name ?? '協賛企業'}
            </h1>
          </div>

          <div className='space-y-6'>
            <ProgressReportFieldRow id='representative' label='代表者' required>
              <Input
                id='representative'
                readOnly
                value={sponsor?.representative ?? ''}
                className={READ_ONLY_FIELD_CLASS_NAME}
              />
            </ProgressReportFieldRow>

            <ProgressReportFieldRow id='phone' label='電話' required>
              <Input
                id='phone'
                readOnly
                value={sponsor?.tel ?? ''}
                className={READ_ONLY_FIELD_CLASS_NAME}
              />
            </ProgressReportFieldRow>

            <ProgressReportFieldRow id='email' label='メール' required>
              <Input
                id='email'
                readOnly
                value={sponsor?.email ?? ''}
                className={READ_ONLY_FIELD_CLASS_NAME}
              />
            </ProgressReportFieldRow>

            <Controller
              name='activityStatus'
              control={control}
              rules={{ required: '活動ステータスを選択してください。' }}
              render={({ field, fieldState }) => (
                <ProgressReportFieldRow
                  id='activityStatus'
                  label='ステータス'
                  required
                  error={fieldState.error?.message}
                >
                  <Select
                    id='activityStatus'
                    value={field.value}
                    onChange={field.onChange}
                    className='h-11 py-0 text-base'
                  >
                    {Object.entries(ACTIVITY_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </ProgressReportFieldRow>
              )}
            />

            <Controller
              name='sponsorStyleDetails'
              control={control}
              render={() => (
                <ProgressReportFieldRow id='sponsorStyleDetails' label='協賛スタイル' required>
                  <Input
                    id='sponsorStyleDetails'
                    readOnly
                    value={formattedSponsorStyles}
                    className={READ_ONLY_FIELD_CLASS_NAME}
                  />
                </ProgressReportFieldRow>
              )}
            />

            <Controller
              name='designProgress'
              control={control}
              rules={{ required: 'デザイン進捗を選択してください。' }}
              render={({ field, fieldState }) => (
                <ProgressReportFieldRow
                  id='designProgress'
                  label='デザイン'
                  required
                  error={fieldState.error?.message}
                >
                  <Select
                    id='designProgress'
                    value={field.value}
                    onChange={field.onChange}
                    className='h-11 py-0 text-base'
                  >
                    {Object.entries(DESIGN_PROGRESS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </ProgressReportFieldRow>
              )}
            />

            <div className='flex flex-wrap justify-center gap-3 pt-1'>
              <OutlinePrimaryButton
                className={OUTLINE_ACTION_CLASS_NAME + ' min-w-32'}
                onClick={() => onDocumentPlaceholder('receipt')}
                disabled={isUpdating}
              >
                領収書発行
              </OutlinePrimaryButton>
              <OutlinePrimaryButton
                className={OUTLINE_ACTION_CLASS_NAME + ' min-w-32'}
                onClick={() => onDocumentPlaceholder('invoice')}
                disabled={isUpdating}
              >
                請求書発行
              </OutlinePrimaryButton>
            </div>

            <Controller
              name='remarks'
              control={control}
              render={({ field }) => (
                <ProgressReportFieldRow id='remarks' label='備考'>
                  <Input
                    id='remarks'
                    value={field.value}
                    onChange={field.onChange}
                    className='h-11 w-full border-[#56daff] text-[#666666]'
                    placeholder=''
                  />
                </ProgressReportFieldRow>
              )}
            />
          </div>

          {Object.keys(errors).length > 0 && (
            <div className='mt-6 rounded-2xl bg-[rgb(228,67,78)]/8 px-4 py-3 text-sm text-[#e4434e]'>
              入力内容を確認してください。
            </div>
          )}

          <div className='mt-8 flex flex-wrap justify-center gap-8'>
            <OutlinePrimaryButton
              className='min-w-20 justify-center border-[#56daff] px-7 py-2 text-[#56daff] font-normal'
              onClick={onClose}
              disabled={isUpdating}
            >
              戻る
            </OutlinePrimaryButton>
            <PrimaryButton
              type='button'
              className={PRIMARY_ACTION_CLASS_NAME + ' min-w-32'}
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
  );
}
