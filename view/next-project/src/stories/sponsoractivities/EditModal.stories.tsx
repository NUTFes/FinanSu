import { ActivityStatus, DesignProgress, FeasibilityStatus } from '@/generated/model';
import { EditModal } from '@components/sponsoractivities';

import { SPONSOR, SPONSOR_STYLE, USER, YEAEPERIOD } from '../constants';

import type { SponsorshipActivity } from '@/generated/model';
import type { Meta, StoryFn } from '@storybook/react';

const MOCK_SPONSORSHIP_ACTIVITY: SponsorshipActivity = {
  id: 1000,
  yearPeriodsId: YEAEPERIOD[0]?.id,
  sponsorId: SPONSOR.id,
  userId: USER.id,
  activityStatus: ActivityStatus.unstarted,
  feasibilityStatus: FeasibilityStatus.unstarted,
  designProgress: DesignProgress.unstarted,
  remarks: 'テスト備考',
  sponsorStyles: [],
  createdAt: '2021-09-01T00:00:00.000Z',
  updatedAt: '2021-09-01T00:00:00.000Z',
};

const meta: Meta<typeof EditModal> = {
  title: 'FinanSu/sponsoractivities/EditModal',
  component: EditModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof EditModal> = (args) => <EditModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  sponsorshipActivityId: '1000',
  sponsorshipActivity: MOCK_SPONSORSHIP_ACTIVITY,
  sponsors: [SPONSOR],
  users: [USER],
  sponsorStyles: [SPONSOR_STYLE],
  yearPeriods: YEAEPERIOD,
};
