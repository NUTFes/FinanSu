import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import ProgressReportLayout from '@/components/progress-report/ProgressReportLayout';
import {
  useGetSponsorshipActivities,
  useGetSponsorshipActivitiesId,
  useGetSponsorstyles,
  usePutSponsorshipActivitiesId,
} from '@/generated/hooks';
import { ActivityStatus, DesignProgress, FeasibilityStatus } from '@/generated/model';
import { useToast } from '@/hooks/useToast';
import { useCurrentUser, useUserStore } from '@/store';
import {
  SponsorshipActivityProgressReportFormValues,
  buildSponsorshipActivityProgressReportPayload,
  getDefaultProgressReportValues,
} from '@/utils/sponsorshipActivityProgressReport';

import type { NextPage } from 'next';

const ProgressReportPage: NextPage = () => {
  const toast = useToast();
  const currentUser = useCurrentUser();
  const userHasHydrated = useUserStore((state) => state._hasHydrated);
  const initializedActivityIdRef = useRef<number | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const isModalOpen = selectedActivityId !== null;
  const sponsorshipActivitiesParams = useMemo(
    () => (currentUser.id ? { user_id: currentUser.id } : undefined),
    [currentUser.id],
  );

  const {
    data: activitiesResponse,
    isLoading: isActivitiesLoading,
    error: activitiesError,
    mutate: mutateActivities,
  } = useGetSponsorshipActivities(sponsorshipActivitiesParams, {
    swr: {
      enabled: userHasHydrated && Boolean(currentUser.id),
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

  const { data: sponsorStylesResponse } = useGetSponsorstyles({
    swr: {
      revalidateOnFocus: false,
    },
  });

  const { trigger: updateSponsorshipActivity, isMutating: isUpdating } =
    usePutSponsorshipActivitiesId(selectedActivityId ?? 0);

  const activity = activityResponse?.data;

  const defaultFormValues: SponsorshipActivityProgressReportFormValues = {
    designProgress: DesignProgress.unstarted,
    activityStatus: ActivityStatus.unstarted,
    feasibilityStatus: FeasibilityStatus.unstarted,
    remarks: '',
    sponsorStyleDetails: [],
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SponsorshipActivityProgressReportFormValues>({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (!activity?.id) return;
    if (initializedActivityIdRef.current === activity.id) return;

    reset(getDefaultProgressReportValues(activity));
    initializedActivityIdRef.current = activity.id;
  }, [activity, reset]);

  const closeModal = () => {
    setSelectedActivityId(null);
    initializedActivityIdRef.current = null;
    reset(defaultFormValues);
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

    if (!activity.yearPeriodsId || !activity.sponsorId || !activity.userId) {
      toast({
        title: 'データエラー',
        description: '協賛活動の更新に必要な関連IDが不足しています。管理者にお問い合わせください。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const payload = buildSponsorshipActivityProgressReportPayload(activity, values);
      await updateSponsorshipActivity(payload);
    } catch (error) {
      console.error('Failed to update sponsorship activity progress report:', error);
      toast({
        title: '更新に失敗しました',
        description: 'しばらくしてから再度お試しください。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: '更新しました',
      description: '進捗報告を更新しました。',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });

    closeModal();

    await Promise.all([mutateActivities(), mutateActivityDetail()]).catch((error) => {
      console.error('Failed to revalidate after update:', error);
    });
  };

  return (
    <ProgressReportLayout
      activities={activities}
      isActivitiesLoading={isActivitiesLoading}
      hasActivitiesError={Boolean(activitiesError)}
      onSelectActivity={(activityId) => {
        setSelectedActivityId(activityId);
      }}
      sponsorStyles={sponsorStylesResponse?.data ?? []}
      isModalOpen={isModalOpen}
      isActivityLoading={isActivityLoading}
      hasActivityError={Boolean(activityError)}
      activity={activity}
      isUpdating={isUpdating}
      control={control}
      handleSubmit={handleSubmit}
      errors={errors}
      onCloseModal={closeModal}
      onSubmit={onSubmit}
    />
  );
};

export default ProgressReportPage;
