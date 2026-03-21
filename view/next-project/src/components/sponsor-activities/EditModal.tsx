import { putSponsorshipActivitiesId } from '@/generated/hooks';
import { SponsorshipActivity } from '@/generated/model';
import { Sponsor, SponsorStyle, User, YearPeriod } from '@type/common';

import SponsorActivityForm, { SponsorActivityFormInitialValues } from './form/SponsorActivityForm';

interface ModalProps {
  sponsorshipActivityId: number | string;
  sponsorshipActivity: SponsorshipActivity;
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  yearPeriods: YearPeriod[];
  setIsOpen: (isOpen: boolean) => void;
  onSaved?: () => Promise<void> | void;
}

export default function EditModal(props: ModalProps) {
  const { sponsorshipActivity, users } = props;

  const initialValues: SponsorActivityFormInitialValues = {
    yearPeriodsId: sponsorshipActivity.yearPeriodsId,
    sponsorId: sponsorshipActivity.sponsorId ?? null,
    bureauId:
      sponsorshipActivity.user?.bureauID ??
      users.find((u) => u.id === sponsorshipActivity.userId)?.bureauID ??
      null,
    userId: sponsorshipActivity.userId ?? null,
    activityStatus: sponsorshipActivity.activityStatus,
    feasibilityStatus: sponsorshipActivity.feasibilityStatus,
    designProgress: sponsorshipActivity.designProgress,
    remarks: sponsorshipActivity.remarks,
    moneyStyleIds: (sponsorshipActivity.sponsorStyles || [])
      .filter((s) => s.category === 'money')
      .map((s) => s.sponsorStyleId)
      .filter((id): id is number => id !== undefined),
    goodsStyleIds: (sponsorshipActivity.sponsorStyles || [])
      .filter((s) => s.category === 'goods')
      .map((s) => s.sponsorStyleId)
      .filter((id): id is number => id !== undefined),
  };

  return (
    <SponsorActivityForm
      users={props.users}
      sponsors={props.sponsors}
      sponsorStyles={props.sponsorStyles}
      yearPeriods={props.yearPeriods}
      initialValues={initialValues}
      setIsOpen={props.setIsOpen}
      submitLabel='修正する'
      failureMessage='修正に失敗しました。時間をおいて再度お試しください。'
      onSubmit={async (payload) => {
        await putSponsorshipActivitiesId(Number(props.sponsorshipActivityId), payload);
      }}
      onSaved={props.onSaved}
    />
  );
}
