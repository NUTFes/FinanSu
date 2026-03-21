import { postSponsorshipActivities } from '@/generated/hooks';
import { Sponsor, SponsorStyle, User, YearPeriod } from '@type/common';

import SponsorActivityForm from './form/SponsorActivityForm';

interface Props {
  users: User[];
  sponsors: Sponsor[];
  sponsorStyles: SponsorStyle[];
  yearPeriods: YearPeriod[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSaved?: () => Promise<void> | void;
}

export default function SponsorActivitiesAddModal(props: Props) {
  return (
    <SponsorActivityForm
      users={props.users}
      sponsors={props.sponsors}
      sponsorStyles={props.sponsorStyles}
      yearPeriods={props.yearPeriods}
      setIsOpen={props.setIsOpen}
      submitLabel='登録'
      failureMessage='登録に失敗しました。時間をおいて再度お試しください。'
      onSubmit={async (payload) => {
        await postSponsorshipActivities(payload);
      }}
      onSaved={props.onSaved}
    />
  );
}
