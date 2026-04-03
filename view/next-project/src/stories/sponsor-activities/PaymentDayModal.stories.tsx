import { PaymentDayModal } from '@components/sponsor-activities/legacy-documents';

import { SPONSOR_ACTIVITY_VIEW } from '../constants';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof PaymentDayModal> = {
  title: 'FinanSu/sponsor-activities/PaymentDayModal',
  component: PaymentDayModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof PaymentDayModal> = (args) => <PaymentDayModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  sponsorActivitiesViewItem: SPONSOR_ACTIVITY_VIEW,
};
