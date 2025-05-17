import { SponsorActivitiesAddModal } from '@components/sponsoractivities';

import { USER, SPONSOR, SPONSOR_STYLE, YEAEPERIOD } from '../constants';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof SponsorActivitiesAddModal> = {
  title: 'FinanSu/sponsoractivities/SponsorActivitiesAddModal',
  component: SponsorActivitiesAddModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof SponsorActivitiesAddModal> = (args) => (
  <SponsorActivitiesAddModal {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  users: [USER],
  sponsors: [SPONSOR],
  sponsorStyles: [SPONSOR_STYLE],
  yearPeriods: YEAEPERIOD,
};
