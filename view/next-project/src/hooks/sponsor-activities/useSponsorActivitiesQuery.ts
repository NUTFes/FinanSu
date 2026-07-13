import { useCallback, useEffect, useRef, useState } from 'react';

import { getSponsorshipActivities } from '@/generated/hooks';
import { GetSponsorshipActivitiesParams, SponsorshipActivity } from '@/generated/model';
import {
  sortSponsorshipActivities,
  SponsorActivitiesFilterType,
} from '@/utils/sponsorshipActivity';

interface UseSponsorActivitiesQueryParams {
  selectedYearPeriodId: number;
  filterData: SponsorActivitiesFilterType;
  allSponsorStyleIds: number[];
}

interface UseSponsorActivitiesQueryResult {
  activities: SponsorshipActivity[];
  totalAmount: number;
  isLoading: boolean;
  fetchSponsorshipActivities: () => Promise<void>;
}

export function useSponsorActivitiesQuery({
  selectedYearPeriodId,
  filterData,
  allSponsorStyleIds,
}: UseSponsorActivitiesQueryParams): UseSponsorActivitiesQueryResult {
  const [activities, setActivities] = useState<SponsorshipActivity[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fetchAbortControllerRef = useRef<AbortController | null>(null);

  const fetchSponsorshipActivities = useCallback(async () => {
    fetchAbortControllerRef.current?.abort();
    const abortController = new AbortController();
    fetchAbortControllerRef.current = abortController;

    setIsLoading(true);

    if (allSponsorStyleIds.length > 0 && filterData.styleIds.length === 0) {
      setActivities([]);
      setTotalAmount(0);
      setIsLoading(false);
      return;
    }

    const params: GetSponsorshipActivitiesParams = {};
    if (selectedYearPeriodId) {
      params.year_periods_id = selectedYearPeriodId;
    }
    if (filterData.feasibilityStatus !== 'all') {
      params.feasibility_status = filterData.feasibilityStatus;
    }
    if (filterData.activityStatus !== 'all') {
      params.activity_status = filterData.activityStatus;
    }
    if (filterData.designProgress !== 'all') {
      params.design_progress = filterData.designProgress;
    }
    if (filterData.userId !== 'all') {
      params.user_id = filterData.userId;
    }
    if (filterData.bureauId !== 'all') {
      params.bureau_id = filterData.bureauId;
    }
    if (
      filterData.styleIds.length > 0 &&
      filterData.styleIds.length !== allSponsorStyleIds.length
    ) {
      params.sponsor_style_ids = filterData.styleIds;
    }

    if (filterData.selectedSort === 'default') {
      params.sort = 'updated_at';
      params.order = 'desc';
    } else if (filterData.selectedSort === 'updateSort') {
      params.sort = 'updated_at';
      params.order = 'asc';
    } else if (filterData.selectedSort === 'createDesSort') {
      params.sort = 'created_at';
      params.order = 'desc';
    } else if (filterData.selectedSort === 'createSort') {
      params.sort = 'created_at';
      params.order = 'asc';
    }

    try {
      const response = await getSponsorshipActivities(params, {
        signal: abortController.signal,
      });
      const nextActivities = response.data.activities || [];

      setTotalAmount(response.data.totalAmount || 0);

      setActivities(
        filterData.selectedSort === 'priceSort' || filterData.selectedSort === 'priceDesSort'
          ? sortSponsorshipActivities(nextActivities, filterData.selectedSort)
          : nextActivities,
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      setActivities([]);
      setTotalAmount(0);
    } finally {
      if (fetchAbortControllerRef.current === abortController) {
        setIsLoading(false);
      }
    }
  }, [allSponsorStyleIds, filterData, selectedYearPeriodId]);

  useEffect(() => {
    fetchSponsorshipActivities();

    return () => {
      fetchAbortControllerRef.current?.abort();
    };
  }, [fetchSponsorshipActivities]);

  return {
    activities,
    totalAmount,
    isLoading,
    fetchSponsorshipActivities,
  };
}
