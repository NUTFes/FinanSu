import Head from 'next/head';

import ProgressReportHeader from '@/components/progress-report/ProgressReportHeader';
import ProgressReportMobileSection from '@/components/progress-report/ProgressReportMobileSection';
import ProgressReportModal from '@/components/progress-report/ProgressReportModal';
import ProgressReportTable from '@/components/progress-report/ProgressReportTable';
import MainLayout from '@components/layout/MainLayout';

import type { ActivityStatus, SponsorshipActivity } from '@/generated/model';
import type { SponsorshipActivityProgressReportFormValues } from '@/utils/sponsorshipActivityProgressReport';
import type { SponsorStyle } from '@type/common';
import type { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

interface ProgressReportLayoutProps {
  activities: SponsorshipActivity[];
  isActivitiesLoading: boolean;
  hasActivitiesError: boolean;
  onSelectActivity: (activityId: number) => void;
  sponsorStyles: SponsorStyle[];
  isModalOpen: boolean;
  isActivityLoading: boolean;
  hasActivityError: boolean;
  activity?: SponsorshipActivity;
  isUpdating: boolean;
  control: Control<SponsorshipActivityProgressReportFormValues>;
  handleSubmit: UseFormHandleSubmit<SponsorshipActivityProgressReportFormValues>;
  errors: FieldErrors<SponsorshipActivityProgressReportFormValues>;
  onCloseModal: () => void;
  onSubmit: (values: SponsorshipActivityProgressReportFormValues) => Promise<void>;
  onActivityStatusChange: (status: ActivityStatus) => void;
}

export default function ProgressReportLayout({
  activities,
  isActivitiesLoading,
  hasActivitiesError,
  onSelectActivity,
  sponsorStyles,
  isModalOpen,
  isActivityLoading,
  hasActivityError,
  activity,
  isUpdating,
  control,
  handleSubmit,
  errors,
  onCloseModal,
  onSubmit,
  onActivityStatusChange,
}: ProgressReportLayoutProps) {
  return (
    <MainLayout>
      <Head>
        <title>進捗報告ページ</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div className='min-h-[calc(100vh-4rem)] px-4 py-10 md:px-8 md:py-16'>
        <div className='mx-auto mt-14 max-w-[1280px] rounded-2xl border border-[#e5e7eb] bg-white px-8 py-8 shadow-[0_4px_14px_rgba(0,0,0,0.12)] md:px-12'>
          <ProgressReportHeader sponsorStyles={sponsorStyles} />
          <ProgressReportMobileSection
            activities={activities}
            isLoading={isActivitiesLoading}
            hasError={hasActivitiesError}
            onSelectActivity={onSelectActivity}
          />
          <div className='hidden md:block'>
            <ProgressReportTable
              activities={activities}
              isLoading={isActivitiesLoading}
              hasError={hasActivitiesError}
              onSelectActivity={onSelectActivity}
            />
          </div>
        </div>
      </div>

      <ProgressReportModal
        isOpen={isModalOpen}
        isLoading={isActivityLoading}
        hasError={hasActivityError}
        activity={activity}
        isUpdating={isUpdating}
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
        onClose={onCloseModal}
        onSubmit={onSubmit}
        onActivityStatusChange={onActivityStatusChange}
      />
    </MainLayout>
  );
}
