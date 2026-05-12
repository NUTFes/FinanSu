import { MdCircle, MdFilterList, MdOutlineFileDownload } from 'react-icons/md';

import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';
import { FilterModal, OpenAddModalButton } from '@/components/sponsor-activities';
import { SponsorshipActivity } from '@/generated/model';
import { createSponsorshipActivityCsv } from '@/utils/createSponsorshipActivityCsv';
import { downloadFile } from '@/utils/downloadFile';
import { SponsorActivitiesFilterType } from '@/utils/sponsorshipActivity';
import { Title } from '@components/common';
import { Sponsor, SponsorStyle, User, YearPeriod } from '@type/common';

interface SponsorActivitiesHeaderProps {
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  yearPeriods: YearPeriod[];
  selectableYearPeriods: (YearPeriod & { id: number })[];
  selectedYearPeriodId: number;
  isFilterOpen: boolean;
  isFiltered: boolean;
  filterData: SponsorActivitiesFilterType;
  sponsorshipActivities: SponsorshipActivity[];
  onSetSelectedYearPeriodId: (value: number) => void;
  onSetFilterOpen: (isOpen: boolean) => void;
  onSetFilterData: (filterData: SponsorActivitiesFilterType) => void;
  fetchSponsorshipActivities: () => Promise<void>;
}

const formatYYYYMMDD = (date: Date) => {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

export default function SponsorActivitiesHeader({
  sponsorStyles,
  sponsors,
  users,
  yearPeriods,
  selectableYearPeriods,
  selectedYearPeriodId,
  isFilterOpen,
  isFiltered,
  filterData,
  sponsorshipActivities,
  onSetSelectedYearPeriodId,
  onSetFilterOpen,
  onSetFilterData,
  fetchSponsorshipActivities,
}: SponsorActivitiesHeaderProps) {
  return (
    <div className='mx-4 mt-8 md:mx-8'>
      <div className='flex flex-col gap-4 md:gap-3'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center'>
          <div className='flex flex-col items-center gap-4 md:flex-row md:gap-11'>
            <Title title={'協賛活動一覧'} />
            <div className='flex gap-2.5'>
              <select
                className='border-black-0 border-b'
                value={selectedYearPeriodId}
                onChange={(event) => {
                  onSetSelectedYearPeriodId(Number(event.target.value));
                }}
              >
                {selectableYearPeriods.map((yearPeriod) => {
                  return (
                    <option value={yearPeriod.id} key={yearPeriod.id}>
                      {yearPeriod.year}年度
                    </option>
                  );
                })}
              </select>
              <div className='relative flex items-center'>
                <button
                  type='button'
                  aria-label='協賛フィルターを開く'
                  className='hover:bg-white-100 rounded-md p-1.5'
                  onClick={() => {
                    onSetFilterOpen(!isFilterOpen);
                  }}
                >
                  <MdFilterList size='22' color='#666666' />
                </button>
                {isFiltered && (
                  <div className='absolute -top-0.5 -right-0.5'>
                    <MdCircle color='rgb(4 102 140)' size={8} />
                  </div>
                )}
              </div>
              {isFilterOpen && (
                <FilterModal
                  setIsOpen={onSetFilterOpen}
                  sponsorStyles={sponsorStyles}
                  sponsors={sponsors}
                  users={users}
                  filterData={filterData}
                  setFilterData={onSetFilterData}
                />
              )}
            </div>
            <PrimaryButton
              className='hidden w-fit whitespace-nowrap md:flex'
              onClick={async () => {
                downloadFile({
                  downloadContent: await createSponsorshipActivityCsv(sponsorshipActivities),
                  fileName: `協賛活動一覧_${formatYYYYMMDD(new Date())}.csv`,
                  isBomAdded: true,
                });
              }}
            >
              <MdOutlineFileDownload size='20' className='mt-0.5 mr-1' />
              CSVダウンロード
            </PrimaryButton>
          </div>
        </div>
        <div className='hidden md:flex md:justify-end'>
          <OpenAddModalButton
            users={users}
            sponsors={sponsors}
            sponsorStyles={sponsorStyles}
            yearPeriods={yearPeriods}
            onSaved={fetchSponsorshipActivities}
          >
            企業協賛登録
          </OpenAddModalButton>
        </div>
      </div>
    </div>
  );
}
