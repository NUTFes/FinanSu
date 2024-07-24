import { Meta, StoryFn } from '@storybook/react';
import { USER, SPONSOR, SPONSOR_STYLE, YEAEPERIOD } from '../constants';
import { SponsorActivitiesAddModal } from '@components/sponsoractivities';

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
