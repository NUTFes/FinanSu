import { SponsorActivitiesFilterType } from '@/utils/sponsorshipActivity';
import { FilterModal } from '@components/sponsor-activities';

import { SPONSOR, SPONSOR_STYLE, USER } from '../constants';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof FilterModal> = {
  title: 'FinanSu/sponsor-activities/FilterModal',
  component: FilterModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof FilterModal> = (args) => <FilterModal {...args} />;

const filterData: SponsorActivitiesFilterType = {
  styleIds: [SPONSOR_STYLE.id || 0],
  bureauId: 'all',
  userId: 'all',
  sponsorId: 'all',
  feasibilityStatus: 'all',
  selectedSort: 'default',
};

export const Primary = Template.bind({});
Primary.args = {
  setIsOpen: () => {},
  sponsorStyles: [SPONSOR_STYLE],
  users: [USER],
  sponsors: [SPONSOR],
  filterData,
  setFilterData: () => {},
};
