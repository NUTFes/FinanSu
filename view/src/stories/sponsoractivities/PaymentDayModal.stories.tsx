import { PaymentDayModal } from '@components/sponsoractivities';

import { SPONSOR_ACTIVITY_VIEW } from '../constants';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof PaymentDayModal> = {
  title: 'FinanSu/sponsoractivities/PaymentDayModal',
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
