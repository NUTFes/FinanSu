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
  isLoading: boolean;
  fetchSponsorshipActivities: () => Promise<void>;
}

export function useSponsorActivitiesQuery({
  selectedYearPeriodId,
  filterData,
  allSponsorStyleIds,
}: UseSponsorActivitiesQueryParams): UseSponsorActivitiesQueryResult {
  const [activities, setActivities] = useState<SponsorshipActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchAbortControllerRef = useRef<AbortController | null>(null);

  const fetchSponsorshipActivities = useCallback(async () => {
    fetchAbortControllerRef.current?.abort();
    const abortController = new AbortController();
    fetchAbortControllerRef.current = abortController;

    setIsLoading(true);

    if (allSponsorStyleIds.length > 0 && filterData.styleIds.length === 0) {
      setActivities([]);
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
    if (filterData.userId !== 'all') {
      params.user_id = filterData.userId;
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
      let nextActivities = response.data.activities || [];
      const selectedStyleIdSet = new Set(filterData.styleIds);

      if (selectedStyleIdSet.size > 0 && selectedStyleIdSet.size !== allSponsorStyleIds.length) {
        nextActivities = nextActivities.filter((activity) =>
          (activity.sponsorStyles || []).some((styleLink) =>
            selectedStyleIdSet.has(styleLink.sponsorStyleId || 0),
          ),
        );
      }

      if (filterData.bureauId !== 'all') {
        nextActivities = nextActivities.filter(
          (activity) => activity.user?.bureauID === filterData.bureauId,
        );
      }
      if (filterData.sponsorId !== 'all') {
        nextActivities = nextActivities.filter(
          (activity) => activity.sponsor?.id === filterData.sponsorId,
        );
      }

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
    isLoading,
    fetchSponsorshipActivities,
  };
}
