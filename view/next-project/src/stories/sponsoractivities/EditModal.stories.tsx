import { EditModal } from '@components/sponsoractivities';

import {
  USER,
  SPONSOR_ACTIVITY,
  SPONSOR_STYLE,
  SPONSOR,
  ACTIVITY_STYLE,
  YEAEPERIOD,
} from '../constants';

import type { Meta, StoryFn } from '@storybook/react';

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
  sponsorActivityId: '1000',
  sponsorActivity: SPONSOR_ACTIVITY,
  sponsorStyles: [SPONSOR_STYLE],
  sponsors: [SPONSOR],
  users: [USER],
  sponsorStyleDetails: [ACTIVITY_STYLE],
  activityStyles: [ACTIVITY_STYLE],
  year: '2024',
  yearPeriods: YEAEPERIOD,
};
