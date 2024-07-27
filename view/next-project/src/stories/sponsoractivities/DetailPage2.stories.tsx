import { Meta, StoryFn } from '@storybook/react';
import { SPONSOR_ACTIVITY_VIEW } from '../constants';
import { DetailPage2 } from '@components/sponsoractivities';

const meta: Meta<typeof DetailPage2> = {
  title: 'FinanSu/sponsoractivities/DetailPage2',
  component: DetailPage2,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof DetailPage2> = (args) => <DetailPage2 {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  id: 1,
  sponsorActivitiesViewItem: SPONSOR_ACTIVITY_VIEW,
  setSponsorActivitiesView: () => {
    SPONSOR_ACTIVITY_VIEW;
  },
};
