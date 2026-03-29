import { useEffect, useRef, useState } from 'react';

import { getSponsorsPeriodsYear } from '@/generated/hooks';
import { Sponsor } from '@type/common';

interface UseSponsorsByYearParams {
  year: number;
  initialSponsors: Sponsor[];
}

export function useSponsorsByYear({ year, initialSponsors }: UseSponsorsByYearParams) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);
  const sponsorFetchAbortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    sponsorFetchAbortControllerRef.current?.abort();
    const abortController = new AbortController();
    sponsorFetchAbortControllerRef.current = abortController;

    const fetchSponsors = async () => {
      if (!year) {
        setSponsors([]);
        return;
      }

      try {
        const sponsorsResponse = await getSponsorsPeriodsYear(year, {
          signal: abortController.signal,
        });
        if (sponsorFetchAbortControllerRef.current === abortController) {
          setSponsors((sponsorsResponse.data || []) as Sponsor[]);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setSponsors([]);
      }
    };

    fetchSponsors();

    return () => {
      abortController.abort();
    };
  }, [year]);

  return sponsors;
}
